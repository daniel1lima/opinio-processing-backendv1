import AWS from 'aws-sdk';

class User {
    constructor() {
        this.dynamoDB = new AWS.DynamoDB();
        this.UserSchema = { // Encapsulated schema
            TableName: 'Users',
            KeySchema: [
                { AttributeName: 'user_id', KeyType: 'HASH' },  // Partition key
                { AttributeName: 'company_id', KeyType: 'RANGE' } // Sort key
            ],
            AttributeDefinitions: [
                { AttributeName: 'user_id', AttributeType: 'S' },
                { AttributeName: 'company_id', AttributeType: 'S' },
                // { AttributeName: 'last_sync', AttributeType: 'S' },
                // { AttributeName: 'last_sync_id', AttributeType: 'S' },
                // { AttributeName: 'email', AttributeType: 'S' }, // New attribute definition
                // { AttributeName: 'first_name', AttributeType: 'S' }, // New attribute definition
                // { AttributeName: 'last_name', AttributeType: 'S' }, // New attribute definition
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 5,
                WriteCapacityUnits: 5,
            },
        };

        this.createTableIfNotExists();
    }

    // Function to create the table if it doesn't exist
    async createTableIfNotExists() {
        try {
            await this.dynamoDB.createTable(this.UserSchema).promise();
            console.log('Table created successfully');
        } catch (error) {
            if (error.code === 'ResourceInUseException') {
                console.log('Table already exists');
            } else {
                console.error('Error creating table:', error);
            }
        }
    }

    // Method to create a new user
    async createUser(userData) {
        // Validate required fields
        if (!userData.user_id || !userData.company_id || !userData.email || !userData.first_name || !userData.last_name) {
            throw new Error("All fields are required.");
        }

        const params = {
            TableName: this.UserSchema.TableName,
            Item: {
                user_id: { S: userData.user_id }, // Updated to use user
                company_id: { S: userData.company_id }, // Updated to use companyId
                last_sync: { S: userData.last_sync || new Date().toISOString() }, // Default to current date if not provided
                email: { S: userData.email }, // New field
                first_name: { S: userData.first_name }, // New field
                last_name: { S: userData.last_name }, // New field
            },
        };

        await this.dynamoDB.putItem(params).promise(); // Store the user in DynamoDB
    }

    // Method to fetch a user by ID
    async fetchUserById(user_id, company_id) { // Added company_id as a parameter
        const params = {
            TableName: this.UserSchema.TableName,
            Key: {
                user_id: { S: user_id }, // Use the user_id to fetch the user
                company_id: { S: company_id }, // Added company_id to the key
            },
        };

        try {
            const data = await this.dynamoDB.getItem(params).promise();
            return data.Item ? AWS.DynamoDB.Converter.unmarshall(data.Item) : null; // Convert DynamoDB item to a plain object
        } catch (error) {
            console.error('Error fetching user:', error);
            throw new Error('Could not fetch user');
        }
    }
}

export default User;