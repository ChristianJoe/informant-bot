import ddb from './dynamodb';

const tableName = process.env.DYNAMODB_QUIZRESPONSES;

export function create(psid, report, quizOption) {
    const key = `${psid}-${report}`;

    return new Promise((resolve, reject) => ddb.put({
        TableName: tableName,
        Item: {
            key, psid, report, quizOption,
        },
        ConditionExpression: 'attribute_not_exists(key)',
    }, (err) => {
        if (err) {
            return reject(err);
        }
        resolve();
    }));
}

export function load(psid, report) {
    const key = `${psid}-${report}`;

    return new Promise((resolve, reject) => ddb.get({
        TableName: tableName,
        Key: {
            key,
        },
        ProjectionExpression: '',
    }, (err, res) => {
        if (err) {
            return reject(err);
        }
        resolve(res.Attributes);
    }));
}

export default {
    create,
    load,
};
