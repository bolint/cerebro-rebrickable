'use strict';

const React = require('react')
const Preview = require('./Preview')
const Settings = require('./Settings')
const cache = require('./cache')
const icon = require('./icon.png')
const { memoize } = require('cerebro-tools')

const baseUrl = 'https://rebrickable.com/api/v3/lego';
var apiKey = '';

cache.load().then(json => {
    apiKey = json.key
})

const saveApiKey = (key) => {
    apiKey = key
    return cache.save({ key })
}

const fetchSets = searchTerm => {
    const url = `${baseUrl}/sets/?search=${encodeURIComponent(searchTerm)}&key=${apiKey}`;
    return fetch(url)
        .then(resp => resp.json())
        .then(resp => resp.results);
};

const fetchParts = searchTerm => {
    const url = `${baseUrl}/parts/?search=${encodeURIComponent(searchTerm)}&key=${apiKey}`;
    return fetch(url)
        .then(resp => resp.json())
        .then(resp => resp.results);
};

const cachedFetchSets = memoize(fetchSets);
const cachedFetchParts = memoize(fetchParts);

const settings = ({ term, display, actions }) => {
    const match = term.match(/^settings(.+)?$/)
    if (match) {
        display({
            icon,
            title: 'Rebrickable Settings',
            subtitle: 'Add your API key',
            onSelect: (event) => actions.open('http://rebrickable.com/api'),
            getPreview: () => (
                <Settings
                    term={match[1]}
                    apiKey={apiKey}
                    onSave={saveApiKey}
                    />
            )
        })
    }
}

const fn = ({term, display, actions}) => {
    if (!apiKey || apiKey == '') {
        settings({term, display, actions});
        return;
    }

    let match = term.match(/rebrick set\s+(.*)/i);

    if (match && match[1] != '') {
        cachedFetchSets(match[1]).then(results => {
            if (!results) return;
            const response = results.map(item => ({
                    icon,
                    id: item.set_num,
                    title: item.name,
                    subtitle: `Pieces: ${item.num_parts} | Year: ${item.year}`,
                    clipboard: item.set_num,
                    onSelect: (event) => actions.open(item.set_url),
                    getPreview: () => <Preview image={item.set_img_url} name={item.name} id={item.set_num}  />
            }));
            display(response);
        });
    } else {
        match = term.match(/rebrick part\s+(.*)/i);

        if (match && match[1] != '') {
            cachedFetchParts(match[1]).then(results => {
                if (!results) return;
                const response = results.map(item => ({
                        icon,
                        id: item.part_num,
                        title: item.name,
                        subtitle: `Part number: ${item.part_num}`,
                        clipboard: item.part_num,
                        onSelect: (event) => actions.open(item.part_url),
                        getPreview: () => <Preview image={item.part_img_url} name={item.name} id={item.part_num}  />
                }));
                display(response);
            });
        }
    }
    settings({term, display, actions})
}

module.exports = {
    fn,
    icon,
    name: 'Find sets/parts on Rebrickable...',
    keyword: '',
}
