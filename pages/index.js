import React, { Component } from 'react';

import fb from '../config/firebase';

import Layout from '../components/layout/Layout';
import Home from '../components/smart/home/Home';

class Index extends Component {
    state = {
        user: {},
    }

    componentDidMount() {
        this.authListener();
    }
    
    authListener() {
        fb.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user,
                });
            } else {
                this.setState({
                    user: null,
                });
            }
        })
    }

    render() {
        return (
            <Layout user={this.state.user}>
                <Home />
            </Layout>
        );
    }
}

export default Index;
