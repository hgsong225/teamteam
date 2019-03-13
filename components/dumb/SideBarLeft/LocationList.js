import React, { Component }from 'react';
import {
    Accordion,
    AccordionItem,
    AccordionItemTitle,
    AccordionItemBody,
} from 'react-accessible-accordion';
import Link from 'next/link';
import axios from 'axios';

// 'Minimal' theme - hide/show the AccordionBody component:
// import 'react-accessible-accordion/dist/minimal-example.css';/

// 'Fancy' theme - boilerplate styles for all components, as seen on our demo:
import '../../../style/sidebar-left.css';
// import 'react-accessible-accordion/dist/fancy-example.css';

class LocationList extends Component {
    static async getInitialProps ({req}) {
        return req
        ? { from: 'server' } // 서버에서 실행 할 시
        : { from: 'client '} // 클라이언트에서 실행 할 시
    }

    static defaultProps = {
        locations: [],
        selectedLocation: {},
        selectLocation: () => {},
    }

    async componentDidMount() {
        console.log('LocationList에서 componentDidMount 실행');
        console.log(this.props);
    }

    selectSido = async (e) => {
        const selectedLocation = {
            sido_name: e.target.innerText,
        }
        console.log('asdfasdf', selectedLocation, this.props);
        
        this.props.selectLocation(selectedLocation);
    }

    selectSigungu = async (sido, sigungu) => {
        const selectedLocation = {
            sido_name: sido,
            sigungu_name: sigungu,
        }
        this.props.selectLocation(selectedLocation);
    }

    selectedMenu = () => {
        const { selectedLocation } = this.props;

        
    }

    render() {
        console.log('LocationList에서 render 실행');
        const { locations, selectedLocation} = this.props;
        const Sido = locations.filter((location, i) => {
            if ((locations[i + 1] && location.sido_code !== locations[i + 1].sido_code) || !locations[i + 1]) {
                return location;
            }
        });
        const processedLocation = [];
        Sido.forEach(
            (sido, i) => {
                processedLocation.push({
                    sido_name: sido.sido_name,
                    sido_code: sido.sido_code,
                    sigungus: [],
                })
                locations.forEach(location => {
                    if (sido.sido_code == location.sido_code) {
                        processedLocation[i].sigungus.push({
                            sigungu_name: location.sigungu_name,
                            sigungu_code: location.sigungu_code,
                        })
                    }
                });
            }
        );

        const list = processedLocation.map(
            (location, i) => {
                return (
                    <AccordionItem
                        key={i}
                        name={location.sido_name}
                        expanded={selectedLocation.sido_name == location.sido_name && true}
                    >
                        <AccordionItemTitle>
                            <Link
                                href={{ pathname: '/post', query: { location: location.sido_name }}}
                            >
                                <a
                                    onClick={this.selectSido}
                                >{location.sido_name}</a>
                            </Link>
                            {
                                location.sigungus.map((sigungu, j) => {
                                    if (sigungu.sigungu_name !== "" && sigungu.sigungu_name !== "null") {
                                        return (
                                            <AccordionItemBody>
                                                <ul
                                                    key={j}
                                                    name={sigungu.sigungu_name}
                                                >
                                                    <li>
                                                        <Link
                                                            href={{ pathname: '/post', query: { location: location.sido_name, sigungu: sigungu.sigungu_name }}}
                                                        >
                                                            <a
                                                            onClick={() => this.selectSigungu(location.sido_name, sigungu.sigungu_name)}
                                                            >{sigungu.sigungu_name}</a>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </AccordionItemBody>
                                        );
                                    }
                                })
                            }
                        </AccordionItemTitle>
                    </AccordionItem>
                );
            }
        );

        return (
            <Accordion
                accordion={true}
            >
                {list}
            </Accordion>
        );
    }

}

export default LocationList;
  