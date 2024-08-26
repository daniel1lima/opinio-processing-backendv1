import AWS from 'aws-sdk';

class Reviews {
    constructor() {
        this.dynamoDB = new AWS.DynamoDB(); // Ensure no local endpoint is set
        this.tableName = 'Reviews';
        this.params = {
            TableName: this.tableName,
            KeySchema: [
                { AttributeName: 'company_id', KeyType: 'HASH' },  // Partition key
                { AttributeName: 'review_id', KeyType: 'RANGE' }   // Sort key
            ],
            AttributeDefinitions: [
                { AttributeName: 'company_id', AttributeType: 'S' }, // String
                { AttributeName: 'review_id', AttributeType: 'S' },  // String
                // { AttributeName: 'business_id', AttributeType: 'S' },
                // { AttributeName: 'review_date', AttributeType: 'S' },
                // { AttributeName: 'rating', AttributeType: 'S' },
                // { AttributeName: 'total_reviews', AttributeType: 'S' },
                // { AttributeName: 'platform_id', AttributeType: 'S' },
                // { AttributeName: 'sentiment', AttributeType: 'N' },
                // { AttributeName: 'polarity', AttributeType: 'N' }
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5
            }
        };

        this.checkTable();
    }

    checkTable() {
        this.dynamoDB.describeTable({ TableName: this.tableName }, (err, data) => {
            if (!err) {
                console.log("Table already exists:", JSON.stringify(data, null, 2));
            } else if (err.code === 'ResourceNotFoundException') {
                this.createTable();
            } else {
                console.error("Error describing table:", JSON.stringify(err, null, 2));
            }
        });
    }

    createTable() {
        this.dynamoDB.createTable(this.params, (createErr, createData) => {
            if (createErr) {
                console.error("Unable to create table. Error JSON:", JSON.stringify(createErr, null, 2));
            } else {
                console.log("Created table. Table description JSON:", JSON.stringify(createData, null, 2));
            }
        });
    }

    fetchReviewById(companyId, reviewId) {
        const params = {
            TableName: this.tableName,
            Key: {
                'company_id': { S: companyId },
                'review_id': { S: reviewId }
            }
        };

        return new Promise((resolve, reject) => {
            this.dynamoDB.getItem(params, (err, data) => {
                if (err) {
                    console.error("Unable to fetch review. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    resolve(this.formatDynamoDBResponse(data.Item));
                }
            });
        });
    }

    createReview(reviewData) {
        const defaults = {
            review_url: 'No Url',
            platform_id: 'Yelp',
            assigned_label: [],
            named_labels: [],
            sentiment: null,
            polarity: null
        };

        const finalData = {
            review_id: reviewData.review_id,
            business_id: reviewData.business_id,
            company_id: reviewData.company_id,
            review_date: reviewData.review_date,
            review_text: reviewData.review_text,
            rating: reviewData.rating,
            total_reviews: reviewData.total_reviews,
            ...defaults,
            ...reviewData
        };

        const params = {
            TableName: this.tableName,
            Item: {
                'company_id': { S: finalData.company_id },
                'review_id': { S: finalData.review_id },
                'business_id': { S: finalData.business_id },
                'review_date': { S: finalData.review_date },
                'review_text': { S: finalData.review_text },
                'review_url': { S: finalData.review_url },
                'rating': { S: finalData.rating },
                'total_reviews': { S: finalData.total_reviews },
                'platform_id': { S: finalData.platform_id },
                'assigned_label': { L: finalData.assigned_label.map(label => ({ S: label })) },
                'named_labels': { L: finalData.named_labels.map(label => ({ S: label })) },
                'sentiment': finalData.sentiment !== null ? { N: finalData.sentiment.toString() } : { NULL: true },
                'polarity': finalData.polarity !== null ? { N: finalData.polarity.toString() } : { NULL: true }
            }
        };

        return new Promise((resolve, reject) => {
            this.dynamoDB.putItem(params, (err, data) => {
                if (err) {
                    console.error("Unable to create review. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    fetchPaginatedReviewsByCompanyId(companyId, page, pageSize) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: 'company_id = :company_id',
            ExpressionAttributeValues: {
                ':company_id': { S: companyId }
            }
        };

        return new Promise((resolve, reject) => {
            this.dynamoDB.query(params, (err, data) => {
                if (err) {
                    console.error("Unable to fetch reviews. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    const reviews = data.Items.map(item => this.formatDynamoDBResponse(item));
                    const startIndex = (page - 1) * pageSize;
                    const paginatedReviews = reviews.slice(startIndex, startIndex + pageSize);
                    resolve(paginatedReviews);
                }
            });
        });
    }

    fetchAllReviews(company_id) {
        const params = {
            TableName: this.tableName,
            FilterExpression: 'company_id = :company_id',
            ExpressionAttributeValues: {
                ':company_id': { S: company_id }
            },
        };

        return new Promise((resolve, reject) => {
            this.dynamoDB.scan(params, (err, data) => {
                if (err) {
                    console.error("Unable to fetch all reviews. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    const reviews = data.Items.map(item => this.formatDynamoDBResponse(item));
                    resolve(reviews);
                }
            });
        });
    }

    countReviewsByCompanyId(companyId) {
        const params = {
            TableName: this.tableName,
            KeyConditionExpression: 'company_id = :company_id',
            ExpressionAttributeValues: {
                ':company_id': { S: companyId }
            },
            Select: 'COUNT'
        };

        return new Promise((resolve, reject) => {
            this.dynamoDB.query(params, (err, data) => {
                if (err) {
                    console.error("Unable to count reviews. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    resolve(data.Count);
                }
            });
        });
    }

    formatDynamoDBResponse(item) {
        if (!item) return null; // Handle case where item is null
        return {
            company_id: item.company_id.S,
            review_id: item.review_id.S,
            business_id: item.business_id.S,
            review_date: item.review_date.S,
            review_text: item.review_text.S,
            review_url: item.review_url.S,
            rating: item.rating.S,
            total_reviews: item.total_reviews.S,
            platform_id: item.platform_id.S,
            assigned_label: item.assigned_label.L.map(label => label.S),
            named_labels: item.named_labels.L.map(label => label.S),
            sentiment: item.sentiment ? parseFloat(item.sentiment.N) : null,
            polarity: item.polarity ? parseFloat(item.polarity.N) : null
        };
    }
}

export default Reviews;