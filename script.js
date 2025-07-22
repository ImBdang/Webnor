const main_api = "https://provinces.open-api.vn/api/?depth=2"
const gemini_api = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
const gemini_key = "AIzaSyAg1B86urF-veuOfJRFOOigza0niXOvYxA"
data_tinhthanh = null
async function get_provinces(){
    data = await fetch(main_api, {method: "GET"}).then(res => res.json())
    .catch(e =>{
        console.log(e)
    })
    return data
}

function gen_string(data){
    if (data == null)
        return
    s = `<option value="-1">Không xác định</option>\n`
    let i = 0
    data.forEach(element => {
        s += `<option value="${i}">${element.name}</option>\n`
        i++
    });
    return s
}

async function gen_ans(question){
    const header = {
        'Content-Type': 'application/json',
        'X-goog-api-key': gemini_key
    }
    let data = {
        contents: [{
            parts: [
                {text: question}
            ]}
        ]
    }
    cautraloi = await fetch (gemini_api, {
        method: "POST", headers: header, body: JSON.stringify(data)
    })
    .then(res => res.json())
    .catch(e =>{
        console.log(e)
    })
    cautraloi = cautraloi["candidates"][0]["content"]["parts"][0]["text"]
    return cautraloi
}

async function tracuu(){
    message_dom = document.getElementById("message")
    if (data_tinhthanh == null){
        message_dom.innerHTML = "<p>Dữ liệu chưa sẵn sàng</p>"
        return 
    }
    province_code = document.getElementById("provinces").value
    districts_code = document.getElementById("districts").value


    if (province_code == -1){
        message_dom.innerHTML = "<p>Vui lòng chọn tỉnh thành</p>"
        return 
    }
    tinhthanh = data_tinhthanh[province_code].name
    if (districts_code == -1)
        quanhuyen = ""
    else
        quanhuyen = data_tinhthanh[province_code].districts[districts_code].name
    console.log(tinhthanh + " " + quanhuyen)
    template = `Giới thiệu về bản sắc nét đẹp về  ${tinhthanh} ${quanhuyen} trong 180 từ`
    message_dom.innerHTML = "<p>Đang tra cứu...</p>"
    cautraloi = await gen_ans(template)
    message_dom.innerHTML = `<p>${cautraloi}</p>`
}

async function main(){
    provinces_dom = document.getElementById("provinces")
    districts_dom = document.getElementById("districts")
    data_tinhthanh = await get_provinces()
    provinces_string = gen_string(data_tinhthanh)
    provinces_dom.innerHTML = provinces_string

    provinces_dom.addEventListener("change", e =>{
        province_code = provinces_dom.value
        districts_data = data_tinhthanh[province_code]["districts"]
        districts_string = gen_string(districts_data)
        districts_dom.innerHTML = districts_string
    })
}

main()
