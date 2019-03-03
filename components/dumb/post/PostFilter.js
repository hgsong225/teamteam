import React, { Component } from 'react';

class PostFilter extends Component {
    static defaultProps = {
        selectedFilter: '전체',
        renderFilterList: [],
    }

    componentDidMount() {
        console.log('PostFilter에서 componentDidMount 실행');
        this.updateRenderFilter();
    }

    updateRenderFilter = () => {
        const { selectedFilter, filterList } = this.props;

        const postFilterList = filterList.map((filter, index) => (
            <div
                key={index}
            >
                <button
                    onClick={this.props.handleFilter}
                    value={filter.name}
                >
                   {filter.name}
                </button>
            </div>
        ));

        this.props.renderFilter(postFilterList);
    }

    render() {
        const { filterList, selectedFilter, renderFilterList } = this.props;

        return (
            <div>
                {renderFilterList}
                {filterList.map(filter => selectedFilter == filter.name && filter.desc)}
            </div>
        );
    }
}

export default PostFilter;