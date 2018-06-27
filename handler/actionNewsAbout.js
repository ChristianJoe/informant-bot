import request from 'request-promise-native';
import moment from 'moment-timezone';
import urls from '../lib/urls';
import fragmentSender from '../lib/fragmentSender';
import { buttonPostback, listElement } from '../lib/facebook';


export const newsAbout = async (chat, payload) => {
    let id;

    try {
        id = await searchId(payload);
    } catch (e) {
        return chat.sendText(`Dazu habe ich leider keine Info...🤔`);
    }

    const report = await request({
        uri: urls.reports,
        json: true,
        qs: id,
    });

    if (report.length === 0) {
        return chat.sendText(`Dazu habe ich leider keine Info...🤔`);
    }

    if (report.length === 1) {
        const data = {
            type: 'report',
            report: report.id,
        };
        const reportDate = moment(report[0].created).tz('Europe/Berlin').format('DD.MM.YYYY');
        await chat.sendText(`${reportDate} - ${report[0].headline}`);
        return fragmentSender(
            chat,
            report[0].next_fragments,
            data,
            report[0].text,
            report[0].media,
        );
    }

    const elements = [];
    report.forEach((r) => {
        const reportDate = moment(r.created).tz('Europe/Berlin').format('DD.MM.YYYY');
        elements.push(listElement(`${reportDate} - ${r.headline}`, r.text, buttonPostback(
            'Lesen 📰',
            {
                action: 'report_start',
                report: r.id,
                type: 'report',
            })
        ));
    });
    return chat.sendList(elements.slice(0, 4));
};

export const searchId = async (payload) => {
    const searchParameter = [
        'genres',
        'tags',
    ];
    const map = {
        genres: 'genres',
        tags: 'tags',
    };

    for (const key of searchParameter) {
        if (payload[key].stringValue === '') {
            continue;
        }

        const data = await request({
            uri: urls[key](payload[key].stringValue),
            json: true,
        });

        if (data.length === 0) {
            continue;
        }
        return {
            [map[key]]: data[0].id,
        };
    }

    throw Error();
};
