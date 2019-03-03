import React, { Component } from 'react';

import Header from './Header';
import View from './View';

class MainView extends Component {
    render () {
        return (
            <div>
                <style jsx>{`
                    .container{
                        display: flex;
                        flex-direction: column;
                        margin-bottom: 80px;
                    }
                    .content {
                        display: flex;
                        justify-content: center;
                        margin-top: 49px;
                    }
                    .view-container {
                        display: flex;
                        justify-content: flex-start;
                        width: 1310px;
                        max-width: 1310px;
                    }
                `}</style>
                <div className="container">
                    <div className="header">
                        <Header />
                    </div>
                    <div className="content">
                        <main className="view-container">
                            <View
                                children={this.props.children}
                            />
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainView;