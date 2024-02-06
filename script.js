document.addEventListener("DOMContentLoaded", function (event) {
    // const form = document.getElementById("dataForm");
    const resultDiv = document.getElementById("result");
    const keys = ['索引值', '房號', '房型', '價格', '附早餐數',];
    var DataObject;

    // Mongodb 資料庫 - 新增功能
    $('#insertBtn').click(function () {

        DataObject = {};
        DataObject[keys[0]] = parseInt($('#input1').val());
        DataObject[keys[1]] = $('#input2').val();
        DataObject[keys[2]] = $('#input3').val();
        DataObject[keys[3]] = parseInt($('#input4').val());
        DataObject[keys[4]] = parseInt($('#input5').val());


        $.ajax({
            url: "/insertData",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(DataObject),
            // data: formData, // 如果要发送 FormData，可以直接传递
            success: function (data) {
                resultDiv.innerText = "資料新增成功!\n" + JSON.stringify(data);
            },
            error: function (error) {
                console.error("Error:", error);
            }
        });
    });

    // Mongodb 資料庫 - 查询功能
    $('#findBtn').click(function () {

        DataObject = {};
        DataObject[keys[0]] = parseInt($('#input1').val());
        DataObject[keys[1]] = $('#input2').val();
        DataObject[keys[2]] = $('#input3').val();
        DataObject[keys[3]] = parseInt($('#input4').val());
        DataObject[keys[4]] = parseInt($('#input5').val());


        $.ajax({
            url: "/findData",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(DataObject),
            // data: formData, // 如果要发送 FormData，可以直接传递
            success: function (data) {
                const retrueData = JSON.stringify(data);
                resultDiv.innerText = "資料查詢成功!\n" + retrueData;

                $('#input1').val(data[0][keys[0]]);
                $('#input2').val(data[0][keys[1]]);
                $('#input3').val(data[0][keys[2]]);
                $('#input4').val(data[0][keys[3]]);
                $('#input5').val(data[0][keys[4]]);

            },
            error: function (error) {
                console.error("Error:", error);
            }
        });
    });

    // Mongodb 資料庫 - 删除功能
    $('#deleteBtn').click(function () {
        DataObject = {};
        DataObject[keys[0]] = parseInt($('#input1').val());
        DataObject[keys[1]] = $('#input2').val();
        DataObject[keys[2]] = $('#input3').val();
        DataObject[keys[3]] = parseInt($('#input4').val());
        DataObject[keys[4]] = parseInt($('#input5').val());

        $.ajax({
            url: "/deleteData",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(DataObject),
            // data: formData, // 如果要发送 FormData，可以直接传递
            success: function (data) {
                resultDiv.innerText = "資料刪除成功!\n" + JSON.stringify(data);
            },
            error: function (error) {
                console.error("Error:", error);
            }
        });
    });

    // Mongodb 資料庫 - 修改功能
    $('#updateBtn').click(function () {
        DataObject = {};
        DataObject[keys[0]] = parseInt($('#input1').val());
        DataObject[keys[1]] = $('#input2').val();
        DataObject[keys[2]] = $('#input3').val();
        DataObject[keys[3]] = parseInt($('#input4').val());
        DataObject[keys[4]] = parseInt($('#input5').val());


        $.ajax({
            url: "/updateData",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(DataObject),
            // data: formData, // 如果要发送 FormData，可以直接传递
            success: function (data) {
                resultDiv.innerText = "資料更新成功!\n" + JSON.stringify(data);
            },
            error: function (error) {
                console.error("Error:", error);
            }
        });
    });
});
