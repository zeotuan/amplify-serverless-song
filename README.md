# SETTING UP INSTRUCTION FOR APP TO WORK

This is an application that allow user to upload and listen to their music.
The application AWS-Amplify
Frontend: React
Backend: AWS-Amplify
+ API: Lambda - Appsync
+ User Authentication: IAM
+ File Storage: S3
+ Database: DynamoDB

## Install Amplify CLI
```
npm install -g @aws-amplify/cli
```

## Initialize Amplify
```
amplify init
```

## Create back-end resources
```
amplify push
```

## Install package dependencies
```
npm install
```

## Run app locally
```
npm start
```


## 🔑 SETTING UP IAM FOR AUTHORIZATION IN AWS:
1. GO TO AWS CONSOLE IAM SECTION WITH THIS LINK: https://console.aws.amazon.com/iam 

2. Navigate to the roles section

3. Find the auth and unauth role that have name in form of: <YourAppName>-<Number>-authRole/unauthRole

4. For the authRole add an inline Policy in form of Json that have the below structure:

These policy allow authenticated user to use the graphql api to create, update and list songs
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "appsync:GraphQL",
            "Resource": [
                "arn:aws:appsync:<REGION>:<ACCOUNT>:apis/<APP-ID>/types/Query/fields/listSongs",
                "arn:aws:appsync:<REGION>:<ACCOUNT>:apis/<APP-ID>/types/Mutation/fields/createSong",
                "arn:aws:appsync:<REGION>:<ACCOUNT>:apis/<APP-ID>/types/Mutation/fields/updateSong"
            ]
        }
    ]
}
```

5. For  the unAuthRole add twp seperate inline Policy in form of Json that have the below structure:
First policy: This allow unauth user to be able to have read access to S3 bucket which store songs audio
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "arn:aws:s3:::<S3-bucket-name>/public/*"
            ],
            "Effect": "Allow"
        }
    ]
}
```

Second Policy: this allow unauth user to be able to have access to graphql api which return list of songs

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": "appsync:GraphQL",
            "Resource": "arn:aws:appsync:<REGION>:<ACCOUNT>:apis/<APP-ID>/types/Query/fields/listSongs"
        }
    ]
}
```

