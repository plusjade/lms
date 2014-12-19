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
        this.props.tabs.forEach(function(d, i) {
            tabs.push(React.DOM.li(
                        {
                            key: d.name,
                            className: (this.state.active === i ? 'active' : null),
                            onClick : this.setActive.bind(this, i)
                        }
                        , d.name
                   ));
        }, this);

        if(this.props.tabs.length > 0 && this.state.active != null) {
            var status;
            if(this.state.payload) {
                status = this.state.payload.status;
            }

            switch (status) {
                case 'error':
                    primary = this.wrapContent(StatusMessage.error(this.state.payload));
                    break;
                default:
                    active = this.props.tabs[this.state.active];
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
    // @param [Integer] i - The tab's index
    setActive : function(i) {
        this.setState({ active : i });
    }
});
NavTabs = React.createFactory(NavTabs);
