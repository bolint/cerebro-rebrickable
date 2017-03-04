'use strict';

const React = require('react');
const Preview = require('./Preview');
const icon = require('./icon.png');
const { memoize } = require('cerebro-tools');

const apiKey = '4ca26878a37f1eb5c0848ec755357ea4';
const baseUrl = 'https://rebrickable.com/api/v3/lego';

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

const fn = ({term, display, actions}) => {
    let match = term.match(/rebrick set\s+(.*)/i);

    if (match && match[1] != '') {
        cachedFetchSets(match[1]).then(results => {
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
}

module.exports = {
    fn,
    icon,
    name: 'Find sets/parts on Rebrickable...',
    keyword: '',
}
