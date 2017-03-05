const React = require('react');
const styles = require('./styles.css');

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.apiKey
        }
    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    handleSubmit(event) {
        event.preventDefault();
        this.props.onSave(this.state.value);
    }
    render() {
        return (
            <div className={styles.settings}>
                <h2>Settings</h2>
                <label for="apiKey">API Key</label><br />
                <input type="text" name="apiKey" value={this.state.value} onChange={this.handleChange.bind(this)} />
                <button onClick={this.handleSubmit.bind(this)}>Save</button>
            </div>
        )
    }
}

module.exports = Settings
