// Sub Tab Navigational component.
// This interface should be as stateless as possible and not care about its parent context.
// The sub tab interface should delegate all responsibility up into its parent context.
var SubTabs = React.createClass({
    displayName: 'SubTabs'
    ,
    getDefaultProps: function() {
        return {
            activeTab : 0,
            tabs: []
        };
    }
    ,
    componentWillMount : function() {
        // Autoload the first tab.
        this.setTab(0);
    }
    ,
    // Note we purposely use '_key' rather than the React-supported 'key'.
    // 'key' keeps the subTabs unique & ensures the component automatically renders on change.
    // However it does so by unmounting & remounting the component (destroying).
    // I assume its more performanent to transition the same UI.
    // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    componentDidUpdate : function(newProps) {
        if( this.props._key && (this.props._key != newProps._key) ) {
            this.setTab(0);
        }
    }
    ,
    render: function() {
        var tabs = [],
            containers = []
        ;

        this.props.tabs.forEach(function(d, i) {
            tabs.push(React.DOM.li(
                        {
                            key: d.name,
                            className: (this.props.activeTab === i ? 'active' : null),
                            onClick : this.setTab.bind(this, i)
                        }
                        , d.name
                   ));

            var classes = [d.name.replace(' ', '-').toLowerCase(), 'tab', 'inner'];
            if(this.props.activeTab === i) classes.push('active');

            containers.push(React.DOM.div(
                        {
                            key: d.name + 'cont',
                            className : classes.join(' ')
                        }
                        , (d.content ? d.content()(this.props) : d.name)
                   ));
        }, this);

        return React.DOM.div(null
                , React.DOM.ul({ className: 'sub-tabs' }, tabs)
                , React.DOM.div({ className: 'sub-tabs-content' }, containers)
            );
    }
    ,
    // Set viewable Tab
    // @param [Integer] i - The tab's index
    setTab : function(i) {
        var updateTabContent = this.props.updateTabContent;

        if(this.props.tabs[i].async) {
            $.ajax({
                url: this.props.tabs[i].async(this.props),
                dataType: "JSON"
            })
            .done(function(rsp) {
                rsp.activeTab = i;
                updateTabContent(rsp);
            });
        }
        else {
            updateTabContent({ activeTab : i })
        }
    }
});
SubTabs = React.createFactory(SubTabs);
