var NavTabs = React.createClass({
    displayName: 'NavTabs'
    ,
    getInitialState: function() {
        return { active : 0, tabs: [] };
    }
    ,
    render: function() {
        var tabs = [],
            containers = []
        ;

        this.state.tabs.forEach(function(d, i) {
            tabs.push(React.DOM.li(
                        {
                            key: d.name,
                            className: (this.state.active === i ? 'active' : null),
                            onClick : this.toggle.bind(this, i)
                        }
                        , d.name
                   ));

            var classes = [d.name.replace(' ', '-').toLowerCase(), 'tab', 'inner'];
            if(this.state.active === i) classes.push('active');

            containers.push(React.DOM.div(
                        {
                            key: d.name + 'cont',
                            className : classes.join(' ')
                        }
                        , (d.content ? d.content(this.state) : d.name)
                   ));
        }, this);

        return React.DOM.div(null
                , React.DOM.ul({ className: 'nav nav-tabs' }, tabs)
                , React.DOM.div({ className: 'tabs-content' }, containers)
            );
    }
    ,
    toggle : function(i) {
        if(this.state.tabs[i].async) {
            $.ajax({
                url: this.state.tabs[i].async,
                dataType: "JSON"
            })
            .done(function(rsp) {
                rsp.active = i;
                MK.Nav.setState(rsp);
            });
        }
        else {
            this.setState({ active : i });
        }
    }
});
NavTabs = React.createFactory(NavTabs);
