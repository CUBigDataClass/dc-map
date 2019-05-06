from pyspark.ml.regression import LinearRegression
from pyspark.ml.linalg import Vectors
from pyspark.ml.feature import VectorAssembler
from pyspark.sql.types import DoubleType
from pyspark.ml.feature import OneHotEncoderEstimator

training = spark.read.format('csv').option("header", "true").load('/nycdata/yellow_tripdata_2018-01.csv')
cleaned_data = training.drop('VendorID', 'tpep_pickup_datetime', 'tpep_dropoff_datetime','store_and_fwd_flag', 'payment_type', 'extra', 'mta_tax', 'tip_amount', 'tolls_amount', 'improvement_surcharge', 'total_amount')

cleaned_data = cleaned_data.withColumn("passenger_count", cleaned_data["passenger_count"].cast(DoubleType()))
cleaned_data = cleaned_data.withColumn("trip_distance", cleaned_data["trip_distance"].cast(DoubleType()))
cleaned_data = cleaned_data.withColumn("RatecodeID", cleaned_data["RatecodeID"].cast(DoubleType()))
cleaned_data = cleaned_data.withColumn("fare_amount", cleaned_data["fare_amount"].cast(DoubleType()))
cleaned_data = cleaned_data.withColumn("PULocationID", cleaned_data["PULocationID"].cast(DoubleType()))
cleaned_data = cleaned_data.withColumn("DOLocationID", cleaned_data["DOLocationID"].cast(DoubleType()))

encoder = OneHotEncoderEstimator(inputCols=["PULocationID", "DOLocationID"], outputCols=["PULocationIDVec", "DOLocationIDVec"])
onehotencoder_model = encoder.fit(cleaned_data)
cleaned_data = onehotencoder_model.transform(cleaned_data)

assembler = VectorAssembler(inputCols=['passenger_count', 'trip_distance', 'RatecodeID', 'PULocationIDVec', 'DOLocationIDVec'],outputCol="features")
lr = LinearRegression(maxIter=10, regParam=0.3, solver="normal", labelCol="fare_amount")
lrModel = lr.fit(cleaned_data)

print("Coefficients: %s" % str(lrModel.coefficients))
print("Intercept: %s" % str(lrModel.intercept))

trainingSummary = lrModel.summary
print("numIterations: %d" % trainingSummary.totalIterations)
print("objectiveHistory: %s" % str(trainingSummary.objectiveHistory))
trainingSummary.residuals.show()
print("RMSE: %f" % trainingSummary.rootMeanSquaredError)
print("r2: %f" % trainingSummary.r2)
