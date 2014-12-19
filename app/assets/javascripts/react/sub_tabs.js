// Sub Tab Navigational component.
// This interface should be as stateless as possible and not care about its parent context.
// The sub tab interface should delegate all responsibility up into its parent context.
var SubTabs = React.createClass({
    displayName: 'SubTabs'
    ,
    getDefaultProps: function() {
        return {
            tabs: [],
            dict: {}
        };
    }
    ,
    componentWillMount : function() {
        // Autoload the first tab.
        this.setTab('materials');
    }
    ,
    // Note we purposely use '_key' rather than the React-supported 'key'.
    // 'key' keeps the subTabs unique & ensures the component automatically renders on change.
    // However it does so by unmounting & remounting the component (destroying).
    // I assume its more performanent to transition the same UI.
    // http://facebook.github.io/react/docs/multiple-components.html#dynamic-children
    componentDidUpdate : function(newProps) {
        if( this.props._key && (this.props._key != newProps._key) ) {
            this.setTab('materials');
        }
    }
    ,
    render: function() {
        var content, tabs = [], containers = [];

        this.props.tabs.forEach(function(key) {
            var d = this.props.dict[key];
            tabs.push(React.DOM.li(
                        {
                            key: key,
                            className: (this.props.activeTab === key ? 'active' : null),
                            onClick : this.setTab.bind(this, key)
                        }
                        , d.name
                   ));

            var classes = [d.name.replace(' ', '-').toLowerCase(), 'tab'];
            if(this.props.activeTab === key) classes.push('active');

            if(this.props.loaded) {
                if(this.props.loaded === 'error') {
                    content = StatusMessage.error(this.props.content);
                }
                else {
                    content = (d.content ? d.content()(this.props) : d.name);
                }
            }
            else {
                content = StatusMessage.loading();
            }

            containers.push(React.DOM.div(
                        {
                            key: d.name + 'cont',
                            className : classes.join(' ')
                        }
                        , content
                   ));
        }, this);

        return React.DOM.div(null
                , React.DOM.ul({ className: 'tabs' }, tabs)
                , React.DOM.div({ className: 'tabs-content' }, containers)
            );
    }
    ,
    // Set viewable Tab
    // @param [String] key - The tab's key
    setTab : function(key) {
        var updatePayload = this.props.updatePayload;
        updatePayload({ loaded: false, activeTab: key });

        if(this.props.dict[key].async) {
            $.ajax({
                url: this.props.dict[key].async(this.props),
                dataType: "JSON"
            })
            .done(function(rsp) {
                rsp.loaded = true;
                updatePayload(rsp);
            })
            .error(function(xhr) {
                updatePayload({
                    loaded: 'error',
                    content: {
                        status: xhr.status,
                        error: xhr.statusText
                    }
                });
            });
        }
        else {
            updatePayload({ activeTab : key })
        }
    }
});
SubTabs = React.createFactory(SubTabs);
