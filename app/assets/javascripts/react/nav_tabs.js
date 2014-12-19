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
            var status;
            if(this.state.payload) {
                status = this.state.payload.status;
            }

            switch (status) {
                case 'error':
                    primary = this.wrapContent(StatusMessage.error(this.state.payload));
                    break;
                default:
                    active = this.props.dict[this.state.active];
                    primary = AsyncLoader(_.extend({
                                            key: active.name.replace(' ', '-'),
                                            handlePayload: this.handlePayload,
                                            payload: this.state.payload
                                        }, active)
                                  );
            }
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
    handlePayload : function(payload) {
        this.setState({ payload: payload });
    }
    ,
    // Set active tab
    // @param [String] key - The tab's key
    setActive : function(key) {
        this.setState({ active : key });
    }
});
NavTabs = React.createFactory(NavTabs);
