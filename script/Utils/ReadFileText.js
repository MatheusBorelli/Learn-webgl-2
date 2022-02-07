export function readFileText(file){
    let rawFile = new XMLHttpRequest();
    let txtFile = null;
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                txtFile = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);
    return txtFile.toString();
}