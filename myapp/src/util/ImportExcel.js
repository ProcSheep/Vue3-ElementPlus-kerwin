import * as XLSX from 'xlsx'
// kerwin给的模板,也可从npmjs官网上学习这个xlsx模块的用法
function importExcel(file,cb){
   
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(file);
    // 等待所有操作完成后 .onload
    fileReader.onload = event => {
        try {
            const { result } = event.target;
            // 以二进制流方式读取得到excel表格对象
            const workbook = XLSX.read(result, { type: 'binary'
            });
     
            let data = []; // 存储获取到的数据
            // 遍历每张工作表进行读取
            for (const sheet in workbook.Sheets) {
                if (workbook.Sheets.hasOwnProperty(sheet)) {
                    // 利用 sheet_to_json 方法将 excel 转成 json 数据
                    data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet],{raw:false})); 
                    // 加上raw:false就能拿到 字符串的日期了
                }
            }
            cb(data)
        } catch (e) {
            // 这里可以抛出文件类型错误不正确的相关提示
            console.log('文件类型不正确');
            return;
        }
    };
    

}
export default importExcel