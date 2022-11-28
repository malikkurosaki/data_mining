const main = $("#main")
const html = main.html()


setInterval(() => {
    $.get('/gambar/ggl').then(val => {
        $("#ggl").attr("src", `data:image/png;base64, ${val}`)
    })
    $.get('/gambar/ytb').then(val => {
        $("#ytb").attr("src", `data:image/png;base64, ${val}`)
    })
    $.get('/gambar/fb').then(val => {
        $("#fb").attr("src", `data:image/png;base64, ${val}`)
    })
    $.get('/gambar/twt').then(val => {
        $("#twt").attr("src", `data:image/png;base64, ${val}`)
    })

    $("#wkt").html((new Date()).toLocaleString())
    console.log("update")
}, 2000);




