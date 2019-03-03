import React, { Component } from 'react';

import Header from './Header';
import SideBarLeft from '../smart/SideBarLeft/SideBarLeft';
import View from './View';

class Layout extends Component {
    static defaultProps = {
        selectedLocation: {},
    }
    
    render() {
        console.log('Layout에서 render() 실행');
        const { selectedLocation } = this.props;
        return (
            <div>
                <style jsx>{`
                    .container{
                        display: flex;
                        flex-direction: column;
                        margin-bottom: 80px;
                    }
                    header {
                    }
                    .content {
                        display: flex;
                        margin-left: 280px;
                        margin-top: 49px;
                        width: auto;
                    }
                    .content aside {
                        border-left:1px solid gray;
                    }
                    nav {
                        width: 280px;
                        height: 100vh;
                        position: fixed;
                    }
                    nav:hover {
                        overflow-y: scroll;                        
                    }
                    nav::-webkit-scrollbar-track
                    {
                        border-radius: 10px;
                        background-color: #f1f1f1;
                    }
                    
                    nav::-webkit-scrollbar
                    {
                        width: 8px;
                        border-radius: 10px;
                        background-color: #fff;
                    }
                    nav::-webkit-scrollbar-thumb
                    {
                        border-radius: 10px;
                        background-color: #e0e0e0;
                    }
                    aside {
                        flex: 5;
                    }
                    main {
                        flex: 7;
                        padding:10px;
                    }
                `}</style>
                <div className="container">
                    <div className="header">
                        <Header />
                    </div>
                    <section>
                        <nav className="sidebar-left-container">
                            <SideBarLeft
                                    selectLocation={this.props.selectLocation}
                                    selectedLocation={selectedLocation}
                                />
                        </nav>
                        <div className="content">
                            <main>
                                <View
                                   children={this.props.children}
                                />
                            </main>
                            <aisde>
                            </aisde>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}

export default Layout;
