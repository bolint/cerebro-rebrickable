const React = require('react');
const styles = require('./styles.css');

module.exports = ({ image, name, id }) => {
    return (
        <div key={id}>
            <h2>{name}</h2>
            <h3>{id}</h3>
            <img src={image} className={styles.preview} alt={name} title={name} />
        </div>
    );
};