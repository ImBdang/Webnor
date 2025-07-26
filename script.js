const provinces_api = "https://kzvqmshdea3rkoaajk3u73bh4a0msndx.lambda-url.ap-southeast-2.on.aws/"
const gemini_api = "https://5rhies7unl5ketoemsi6xs53oq0ocnrh.lambda-url.ap-southeast-2.on.aws/"

async function get_provinces(code){
    const params = new URLSearchParams({
        province_code: code
    });

    const url = `${provinces_api}?${params.toString()}`
    data = await fetch(url, {method: "GET"}).then(res => res.json())
    .catch(e => {
        console.log(e)
    })
    return data
}

async function gen_ans(cauhoi){
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    }
    data = {
        "cauhoi": cauhoi
    }
    cautraloi = await fetch(gemini_api, {method: "POST", headers: headers, body: JSON.stringify(data)}).then(res => res.json())
    .catch(e =>{
        console.log(e)
    })

    return cautraloi["cautraloi"]
}

function gen_string(data){
    if (data == null)
        return
    s = `<option value="-1">Không xác định</option>\n`
    data.forEach(element => {
        s += `<option value="${element.code}">${element.name}</option>\n`
    });
    return s
}

async function handleChange(districts_dom, province_code) {
    if (province_code != "-1") {
        let districts_data = await get_provinces(province_code);
        let districts_string = gen_string(districts_data["data"]);
        districts_dom.innerHTML = districts_string;
    }
}

async function tracuu(){
    message_dom = document.getElementById("message")
    provinces_dom = document.getElementById("provinces")
    districts_dom = document.getElementById("districts")

    province_code = provinces_dom.value
    district_code = districts_dom.value

    if (province_code == "-1"){
        message_dom.innerHTML = "<p>Vui lòng chọn tỉnh thành</p>"
        return 
    }
    tinhthanh = provinces_dom.options[provinces_dom.selectedIndex].text
    if (district_code == "-1")
        quanhuyen = ""
    else
        quanhuyen = districts_dom.options[districts_dom.selectedIndex].text

    template = `Giới thiệu về bản sắc nét đẹp về  ${tinhthanh} ${quanhuyen} trong 180 từ`
    message_dom.innerHTML = "<p>Đang tra cứu...</p>"
    cautraloi = await gen_ans(template)
    message_dom.innerHTML = `<p>${cautraloi}</p>`
}

async function main(){
    provinces_dom = document.getElementById("provinces")
    districts_dom = document.getElementById("districts")
    data_tinhthanh = await get_provinces("00")
    data_tinhthanh = data_tinhthanh["data"]
    provinces_string = gen_string(data_tinhthanh)
    provinces_dom.innerHTML = provinces_string

    provinces_dom.addEventListener("change", e =>{
        province_code = provinces_dom.value
        handleChange(districts_dom, province_code)
    })
}

main()