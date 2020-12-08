const Excel = require('exceljs');
const catchAsync = require('./catchAsync');
const path = require('path');


module.exports= catchAsync(async function Export(data,id,col) {
let workbook = new Excel.Workbook();

if (col === 'tours'){
  var worksheet = workbook.addWorksheet('tours');

worksheet.columns = [
    {header: 'Tour', key: `tour`, width: 20},
    {header: 'RatingsAverage', key: `ratingsAverage`, width: 15},
    {header: 'Duration', key: `duration`, width: 15},
    {header: 'MaxGroupSize', key: `maxGroupSize`, width: 15},
    {header: 'Difficulty', key: `difficulty`, width: 15},
    {header: 'Price', key: `price`, width: 15},
    {header: 'Summary', key: `summary`, width: 67}
];

data.forEach((e) => {
  worksheet.addRow(
     [e.name,e.ratingsAverage,e.duration,e.maxGroupSize,e.difficulty,e.price,e.summary]
      );
});

}else if (col === 'users'){
  var worksheet = workbook.addWorksheet('users');

worksheet.columns = [
    {header: 'User', key: `user`, width: 20},
    {header: 'Email', key: `email`, width: 31},
    {header: 'Role', key: `role`, width: 15},
    {header: 'Active', key: `active`, width: 15},
    {header: 'Retry', key: `retry`, width: 15},
];

const status = []

data.map(el => el.active === true ? status.push('yes') : status.push('no'))

data.forEach((e,i) => {
  worksheet.addRow(
     [e.name,e.email,e.role,status[i],e.retry]
      );
});
}
  
  
  
// Make the header bold.
// Note: in Excel the rows are 1 based, meaning the first row is 1 instead of 0.
worksheet.getRow(1).font = {bold: true};


// Create a freeze pane, which means we'll always see the header as we scroll around.
worksheet.views = [
    { state: 'frozen', xSplit: 0, ySplit: 1, activeCell: 'B2' }
  ]
  
// Keep in mind that reading and writing is promise based.
await workbook.xlsx.writeFile(path.join(__dirname, `./../dev-data/data/${col}-${id}-${Date.now()}.xlsx`));

});
