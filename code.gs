//Global Variables
const app = SpreadsheetApp;
const ss = app.getActiveSpreadsheet();
const sheets = ss.getSheetByName('SS List');
const dataSheet = ss.getSheetByName('Data')
const scriptCache = CacheService.getScriptCache();

//write data to destination spreadsheets
function addDataToSheets(sheets){
  dataToSend = dataSheet.getRange(2,1,dataSheet.getLastRow(),2).getValues()
  sheets.map(dest => SpreadsheetApp.openByUrl(dest).getActiveSheet().insertRowsBefore(1,dataSheet.getLastRow()-1).getRange(1,1,dataSheet.getLastRow(),2).setValues(dataToSend))

}

function sendData() {

  //Check if data is in cache
  const key = "spreadsheets";
  const cacheStart = new Date();
  let data = scriptCache.get(key)

  //performa action (this will not happen the first time)
    if(data){
   
      const cacheEnd = new Date();
      const array = data.split(",")
      addDataToSheets(array)
     
      Logger.log(`Reading from the cache took: ${(cacheEnd - cacheStart) / 1000} seconds`)
    } else{
      //if data is not in cache, perform the action and also add the data to the cache
      start = new Date();
      
      const destinations = sheets.getRange(2,2,sheets.getLastRow()-1,1).getValues()
      addDataToSheets(destinations)
      
      end = new Date();

      scriptCache.put(key, destinations);
      Logger.log(`Reading from the spreadsheet took: ${(end - start) / 1000} seconds`)
    }
  }

function clearAllData(){
  const destinations = sheets.getRange(2,2,sheets.getLastRow()-1,1).getValues();
  destinations.map(dest => SpreadsheetApp.openByUrl(dest[0]).getActiveSheet().getRange(1,1,200,2).clear());
}

function clearCache(){
  scriptCache.remove('spreadsheets')
  Logger.log(scriptCache.get('spreadsheets'))
}





