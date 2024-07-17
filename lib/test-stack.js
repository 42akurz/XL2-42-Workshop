const { Stack, Duration, RemovalPolicy } = require('aws-cdk-lib');
const { Function, Runtime, Code } = require("aws-cdk-lib/aws-lambda");
const { LambdaRestApi, Cors } = require("aws-cdk-lib/aws-apigateway");
const { Bucket } = require('aws-cdk-lib/aws-s3');
const { Distribution } = require('aws-cdk-lib/aws-cloudfront');
const { S3Origin } = require('aws-cdk-lib/aws-cloudfront-origins');
const { BucketDeployment, Source } = require('aws-cdk-lib/aws-s3-deployment');

class TestStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    // The code that defines your stack goes here
    const hello = new Function(this, 'YourHandlerName', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset('lambda'),
      handler: 'hello.handler'
    });
    
    const api = new LambdaRestApi(this, 'YourApiName', {
      handler:hello,
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS, // Allow all origins
        allowMethods: Cors.ALL_METHODS  // Allow all methods
      }
    })
    
    const websiteBucket = new Bucket(this, "VDDTestAlexBucketXXX", {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY,
      bucketName: "vdd-test-alex-bucket-xxx",
      autoDeleteObjects: true,
    });
    
        // Deploy local files to the S3 bucket
    new BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset('./files')], // Path to your local files folder
      destinationBucket: websiteBucket,
      destinationKeyPrefix: '', // Optional: specify a key prefix
    });
    
    new Distribution(
      this,
      "VDDTestAlexDistribution",
      {
        defaultBehavior: { origin: new S3Origin(websiteBucket) },
        defaultRootObject: "index.html",
      }
    );
  }
}

module.exports = { TestStack }
