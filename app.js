const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');
// const multiparty = require('multiparty');

const { MongoClient } = require('mongodb');
const mongodb_url = 'mongodb://127.0.0.1:27017';// MongoDB 连接 URI
const client = new MongoClient(mongodb_url);

const keys = ['索引值', '房號', '房型', '價格', '附早餐數',];
const server = http.createServer((req, res) => {

    const parsedUrl = url.parse(req.url);
    const parsedQuery = querystring.parse(parsedUrl.query);

    //開起根目錄網頁
    //=======================================
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }

    //當收到網頁回傳資料
    //=======================================
    if (req.method === 'POST') {

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // 将请求数据拼接起来
        });

        req.on('end', () => {
            const ClientData = JSON.parse(body); // 解析 JSON 格式的请求数据
            const DataArray = Object.values(ClientData);

            const db = client.db('DB100'); // 你的数据库名称
            const collection = db.collection('Score'); // 你的集合名称

            if (parsedUrl.pathname === '/insertData') {
                const queryPromises = [];

                const queryPromise = collection.insertOne(ClientData);
                queryPromises.push(queryPromise);

                Promise.all(queryPromises)
                    .then((results) => {
                        const items = results.flat();
                        console.log('資料庫寫入成功!!');
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(ClientData));
                        console.log('已新增一筆資料，資料內容如下:', JSON.stringify(ClientData));
                    })
                    .catch((err) => {
                        onsole.error('資料庫寫入失敗:', err);
                    });
            }

            if (parsedUrl.pathname === '/findData') {

                const queryPromises = [];
                const query = {};
                for (let i = 0; i < DataArray.length; i++) {
                    const value = DataArray[i];

                    // 如果值不为空，加入查詢條件
                    if ((value !== null) && (value !== '')) {
                        query[keys[i]] = value;
                    }
                }
                const queryPromise = collection.find(query).toArray();
                queryPromises.push(queryPromise);

                Promise.all(queryPromises)
                    .then((results) => {
                        const items = results.flat();

                        console.log('資料庫查詢成功!!');
                        console.log('已查詢資料，資料內容如下:', JSON.stringify(items));
                        console.log('找到', JSON.stringify(items.length), '筆資料');

                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(items));
                    })
                    .catch((err) => {
                        console.error('資料庫查詢失敗:', err);
                    });
            }

            if (parsedUrl.pathname === '/deleteData') {
                const queryPromises = [];
                const deleteeQuery = {};
                deleteeQuery[keys[0]] = DataArray[0];

                const queryPromise = collection.deleteOne(deleteeQuery, { w: 1 });
                queryPromises.push(queryPromise);

                Promise.all(queryPromises)
                    .then((results) => {
                        const items = results.flat();
                        console.log('刪除成功!!');
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(ClientData));
                        console.log('已刪除一筆資料，如下資料:' + JSON.stringify(ClientData));
                    })
                    .catch((err) => {
                        onsole.error('刪除失敗:', err);
                    });
            }

            if (parsedUrl.pathname === '/updateData') {
                const queryPromises = [];
                const updateQuery = {};
                updateQuery[keys[0]] = DataArray[0];

                const updateData = {};
                for (let i = 1; i < DataArray.length; i++) {
                    updateData[keys[i]] = DataArray[i];
                }
                const updateFields = { $set: updateData };

                const queryPromise = collection.updateOne(updateQuery, updateFields, { w: 1 });
                queryPromises.push(queryPromise);

                Promise.all(queryPromises)
                    .then((results) => {
                        const items = results.flat();
                        console.log('更新成功!!');
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(ClientData));
                        console.log('已更新一筆資料，將' + JSON.stringify(updateQuery) + '這筆資料進行更新，修改內容如下:' + JSON.stringify(updateData));
                    })
                    .catch((err) => {
                        onsole.error('更新失敗:', err);
                    });
            }

        });

    } else {
        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code == 'ENOENT') {
                    res.writeHead(404);
                    res.end('404 Not Found');
                } else {
                    res.writeHead(500);
                    res.end('500 Internal Server Error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    //連線資料庫
    client.connect();
    console.log('成功連接到 MongoDB');
});
