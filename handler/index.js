
module.exports = {
    actions: {
        'current_time': require('./actionCurrentTime'),
        'current_news': require('./actionCurrentNews'),
        'subscriptions': require('./payloadSubscribe').subscriptions,
    },
    payloads: {
        'report_start': require('./payloadReportStart'),
        'fragment_next': require('./payloadFragmentNext'),
        'faq': require('./payloadFaq').default,
        'push_outro': require('./payloadPushOutro'),
        'subscriptions': require('./payloadSubscribe').subscriptions,
        'subscribe': require('./payloadSubscribe').subscribe,
        'unsubscribe': require('./payloadSubscribe').unsubscribe,
        'share': require('./payloadShare.js'),
        'current_news': require('./actionCurrentNews'),
    },
};
