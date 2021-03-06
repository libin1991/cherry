import React from 'react';

import { Layout } from 'antd';
const {Content} = Layout;
import Render from './render';

export default class ContentView extends React.Component {

    token;

    constructor(props) {
        super(props);
    }

    render() {
        const {match, db} = this.props;
        const pageName = match.params.pageName;

        const page = require(`${db.source[pageName]}`);

        return (
            <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                <Render page={page}/>
            </Content>
        )
    }
}
