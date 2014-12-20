var NavTabs = React.createClass({
    displayName: 'NavTabs'
    ,
    mixins : [ContentMixin]
    ,
    getInitialState: function() {
        return { active : null };
    }
    ,
    render: function() {
        var tabs = [], active, primary;
        this.props.tabs.forEach(function(key) {
            tabs.push(React.DOM.li(
                        {
                            key: key,
                            className: (this.state.active === key ? 'active' : null),
                            onClick : this.setActive.bind(this, key)
                        }
                        , this.props.dict[key].name
                   ));
        }, this);

        if(this.props.tabs.length > 0 && this.state.active) {
            active = this.props.dict[this.state.active];
            var wrapContent = this.wrapContent;
            primary = AsyncLoader(_.extend(
                                    active
                                    ,
                                    {
                                        key: active.key,
                                        handleResponse: this.updatePayload,
                                        payload: _.extend({ updatePayload: this.updatePayload }, this.state.payload),
                                        loading : function() {
                                            return wrapContent(StatusMessage.loading());
                                        },
                                        error : function(payload) {
                                            return wrapContent(StatusMessage.error(payload));
                                        }
                                    }
                                )
                          );
        }

        return React.DOM.div(null
                , React.DOM.div({ className: 'primary-navigation' }
                    , React.DOM.div({ id: 'heading' }
                        , React.DOM.a({ href: '/' }, this.props.courseName)
                    )
                    , React.DOM.ul({ className: 'nav-tabs' }, tabs)
                )
                , primary
            );
    }
    ,
    updatePayload : function(payload) {
        this.setState({ payload: _.extend({}, this.state.payload, payload) });
    }
    ,
    // Set active tab
    // @param [String] key - The tab's key
    setActive : function(key) {
        this.setState({ active : key });
    }
});
NavTabs = React.createFactory(NavTabs);
