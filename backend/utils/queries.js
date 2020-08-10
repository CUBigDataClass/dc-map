// // Import a CSV file
// mongoimport --username admin --password iambatman2611 --db nycdata --collection yellow_tripdata_2014-01 --file yellow_tripdata_2014-01.csv --type=csv --headerline
//
//
// db["Sample"].aggregate([{"$addFields": {"name": { "$substr": ["$temp", 8, 9] }}},{ "$out": "Sample" }])
//
// // CREATE ride_date
// db["yellow_tripdata_2018-01"].aggregate([{"$addFields":{"ride_date":{"$substr": ["$tpep_pickup_datetime", 0, 9]}}},{"$out" : "yellow_tripdata_2018-01"}])
//
// // CREATE pickupdatetimebin
// db["yellow_tripdata_2018-01"].aggregate([{"$addFields":{"tpep_pickup_datetime_bin":{"$substr": ["$tpep_pickup_datetime", 11, 2]}}},{"$out" : "yellow_tripdata_2018-01"}])
//
// // CREATE dropoffdatetimebin
// db["yellow_tripdata_2018-01"].aggregate([{"$addFields":{"tpep_dropoff_datetime_bin":{"$substr": ["$tpep_dropoff_datetime", 11, 2]}}},{"$out" : "yellow_tripdata_2018-01"}])
//
// // Sample indexing command (also perform for ride_date)
// db["yellow_tripdata_2018-01"].createIndex( { "tpep_pickup_datetime_bin": 1 }, {"background":true} )
// //
// //
// //
// // for old data
// //
// //
//
// db["yellow_tripdata_2014-01"].aggregate([{"$addFields":{"ride_date":{"$substr": ["$pickup_datetime", 0, 10]}}},{"$out" : "yellow_tripdata_2014-01"}])
