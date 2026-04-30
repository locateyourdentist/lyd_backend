const AWS = require('aws-sdk');
const fs = require('fs');

class S3FileUploader {
    constructor(config) {
        this.config = config;
        this.s3 = new AWS.S3({
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
            region: config.region,
        });
    }

    async uploadFile(filePath, destinationPath) {
        try {
            const fileContent = fs.readFileSync(filePath);
            const params = {
                Bucket: this.config.bucketName,
                Key: destinationPath,
                Body: fileContent,
            };

            const data = await this.s3.upload(params).promise();
            console.log('File uploaded successfully. S3 Location:', data.Location);
            return data.Location;
        } catch (error) {
            console.error('Error uploading file to S3:', error);
            throw error;
        }
    }
}

module.exports = S3FileUploader;