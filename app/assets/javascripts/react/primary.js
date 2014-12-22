var Primary = React.createClass({
    displayName: 'Primary'
    ,
    mixins : [ContentMixin]
    ,
    render: function() {
        var props, wrapContent;
        wrapContent = this.wrapContent;

        props = _.extend(
                {},
                this.props.tab,
                {
                    key: this.props.tab.key,
                    response: this.props.response,
                    props: _.omit(this.props, 'response') ,
                    handleResponse: this.props.handleResponse,
                    loading: function() {
                        return wrapContent(StatusMessage.loading());
                    },
                    error: function(response) {
                        return wrapContent(StatusMessage.error(response));
                    }
                }
            )
        ;

        return AsyncLoader(props);
    }
});
Primary = React.createFactory(Primary);
