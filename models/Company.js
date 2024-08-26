import { dynamoDB } from '../awsConfig.js';

class Company {
    constructor() {
        this.dynamoDB = dynamoDB;
        this.tableName = 'Companies';
        this.params = {
            TableName: this.tableName,
            KeySchema: [
                { AttributeName: 'company_id', KeyType: 'HASH' }  // Partition key
            ],
            AttributeDefinitions: [
                { AttributeName: 'company_id', AttributeType: 'S' }, // String
                // { AttributeName: 'company_name', AttributeType: 'S' },
                // { AttributeName: 'industry_id', AttributeType: 'S' },
                // { AttributeName: 'country', AttributeType: 'S' },
                // { AttributeName: 'city', AttributeType: 'S' },
                // { AttributeName: 'date_joined', AttributeType: 'S' },
                // { AttributeName: 'active', AttributeType: 'B' } // Boolean
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

    fetchCompanyItemById(companyId) {
        console.log("Fetching item with company_id:", companyId); // Log the companyId

        const params = {
            TableName: this.tableName,
            Key: {
                'company_id': { S: companyId }  // Correctly structure the key
            }
        };

        console.log("Params for getItem:", JSON.stringify(params, null, 2)); // Log the params

        return new Promise((resolve, reject) => {
            this.dynamoDB.getItem(params, (err, data) => {
                if (err) {
                    console.error("Unable to fetch item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err); // Reject the promise with the error
                } else {
                    console.log("Fetched item:", JSON.stringify(data, null, 2));
                    resolve(this.formatDynamoDBResponse(data.Item)); // Format the response
                }
            });
        });
    }

    formatDynamoDBResponse(item) {
        if (!item) return null; // Handle case where item is null
        const formattedItem = {};
        for (const key in item) {
            if (item[key].S !== undefined) {
                formattedItem[key] = item[key].S; // Handle string
            } else if (item[key].BOOL !== undefined) {
                formattedItem[key] = item[key].BOOL; // Handle boolean
            }
            // Add more type checks if necessary
        }
        return formattedItem;
    }

    createCompany(companyData) {
        // Set default values
        const defaults = {
            company_name: 'Unknown Company',
            industry_id: 'N/A',
            country: 'Unknown',
            city: 'Unknown',
            date_joined: new Date().toISOString(), // Current date
            active: true // Default to active
        };

        // Merge provided companyData with defaults
        const finalData = {
            company_id: companyData.company_id,
            company_name: companyData.company_name || defaults.company_name,
            industry_id: companyData.industry_id || defaults.industry_id,
            country: companyData.country || defaults.country,
            city: companyData.city || defaults.city,
            date_joined: companyData.date_joined || defaults.date_joined,
            active: companyData.active !== undefined ? companyData.active : defaults.active
        };

        const params = {
            TableName: this.tableName,
            Item: {
                'company_id': finalData.company_id, // No type indicator
                'company_name': finalData.company_name, // No type indicator
                'industry_id': finalData.industry_id, // No type indicator
                'country': finalData.country, // No type indicator
                'city': finalData.city, // No type indicator
                'date_joined': finalData.date_joined, // No type indicator
                'active': finalData.active // No type indicator
            }
        };

        return new Promise((resolve, reject) => {
            this.dynamoDB.putItem(params, (err, data) => {
                if (err) {
                    console.error("Unable to create company. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err); // Reject the promise with the error
                } else {
                    console.log("Created company:", JSON.stringify(data, null, 2));
                    resolve(data); // Resolve the promise with the result
                }
            });
        });
    }

    wipeTableContents() {
        const params = {
            TableName: this.tableName
        };

        // Scan the table to get all items
        this.dynamoDB.scan(params, (err, data) => {
            if (err) {
                console.error("Unable to scan table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                const items = data.Items;
                if (items.length === 0) {
                    console.log("Table is already empty.");
                    return;
                }

                // Delete each item
                items.forEach(item => {
                    const deleteParams = {
                        TableName: this.tableName,
                        Key: {
                            'company_id': { S: item.company_id.S } // Adjust based on your key structure
                        }
                    };

                    this.dynamoDB.deleteItem(deleteParams, (deleteErr) => {
                        if (deleteErr) {
                            console.error("Unable to delete item. Error JSON:", JSON.stringify(deleteErr, null, 2));
                        } else {
                            console.log("Deleted item:", JSON.stringify(item, null, 2));
                        }
                    });
                });
            }
        });
    }
}

export default Company