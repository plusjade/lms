var NavTabs = React.createClass({
    displayName: 'NavTabs'
    ,
    getInitialState: function() {
        return { active : 0, tabs: [] };
    }
    ,
    render: function() {
        var tabs = [], content, active;
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
            content = React.DOM.div(
                        {
                            key: active.name + 'cont',
                            className : (active.name.replace(' ', '-').toLowerCase() + ' inner')
                        }
                        , (active.content ? active.content(this.state.content) : active.name)
                   );
        }


        return React.DOM.div(null
                , React.DOM.h2({ id: 'heading' }
                        , React.DOM.a({ href: '/' }, this.state.courseName)
                )
                , React.DOM.ul({ className: 'nav-tabs' }, tabs)
                , React.DOM.div({ className: 'primary-content' }, content)
            );
    }
    ,
    // Set viewable Tab
    // @param [Integer] i - The tab's index
    setTab : function(i) {
        if(this.state.tabs[i].async) {
            if(typeof this.state.tabs[i].async === 'function') {
                var state = {};
                state.content = this.state.tabs[i].async();
                state.active = i;
                this.setState(state);
            }
            else {
                var self = this;

                $.ajax({
                    url: this.state.tabs[i].async,
                    dataType: "JSON"
                })
                .done(function(rsp) {
                    var state = {};
                    state.content = rsp;
                    state.active = i;
                    self.setState(state);
                });
            }
        }
        else {
            this.setState({ active : i });
        }
    }
});
NavTabs = React.createFactory(NavTabs);
