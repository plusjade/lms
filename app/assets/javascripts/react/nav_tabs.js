var NavTabs = React.createClass({
    displayName: 'NavTabs'
    ,
    mixins : [ContentMixin]
    ,
    getInitialState: function() {
        return { active : 0, tabs: [] };
    }
    ,
    render: function() {
        var tabs = [], active, primary;
        this.state.tabs.forEach(function(d, i) {
            tabs.push(React.DOM.li(
                        {
                            key: d.name,
                            className: (this.state.active === i ? 'active' : null),
                            onClick : this.setTab.bind(this, i)
                        }
                        , d.name
                   ));
        }, this);

        if(this.state.tabs.length > 0 && this.state.active > -1) {
            active = this.state.tabs[this.state.active];

            if(this.state.loaded) {
                if(this.state.loaded === 'error') {
                    primary = this.wrapContent(StatusMessage.error(this.state.content));
                }
                else {
                    primary = active.content
                                    ? active.content(this.state.content)
                                    : active.name
                    ;
                }
            }
            else {
                primary = this.wrapContent(StatusMessage.loading());
            }
        }

        return React.DOM.div(null
                , React.DOM.div({ className: 'primary-navigation' }
                    , React.DOM.div({ id: 'heading' }
                        , React.DOM.a({ href: '/' }, this.state.courseName)
                    )
                    , React.DOM.ul({ className: 'nav-tabs' }, tabs)
                )
                , primary
            );
    }
    ,
    // Set viewable Tab
    // @param [Integer] i - The tab's index
    setTab : function(i) {
        if(this.state.tabs[i].async) {
            if(typeof this.state.tabs[i].async === 'function') {
                this.setState({
                    active: i,
                    content: this.state.tabs[i].async()
                });
            }
            else {
                var self = this, state = { loaded: false, active: i };
                this.setState(state);

                $.ajax({
                    url: this.state.tabs[i].async,
                    dataType: "JSON"
                })
                .done(function(rsp) {
                    self.setState({
                        loaded: true,
                        content: rsp
                    });
                })
                .error(function(xhr) {
                    self.setState({
                        loaded: 'error',
                        content: {
                            status: xhr.status,
                            error: xhr.statusText
                        }
                    });
                })
            }
        }
        else {
            this.setState({ active : i });
        }
    }
});
NavTabs = React.createFactory(NavTabs);
