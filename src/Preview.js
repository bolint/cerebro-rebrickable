const React = require('react');
const styles = require('./styles.css');

module.exports = ({ image, name, id }) => {
    return (
        <div className={styles.preview}>
            <h2>{name}</h2>
            <h3>{id}</h3>
            {image && <img src={image} alt={name} title={name} />}
        </div>
    );
};