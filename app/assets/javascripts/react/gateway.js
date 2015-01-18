var Gateway = React.createClass({
    displayName: 'Gateway'
    ,
    propTypes : {
        course : React.PropTypes.object.isRequired,
        user : React.PropTypes.object.isRequired,
        CSRFTOKEN : React.PropTypes.string.isRequired
    }
    ,
    getInitialState : function() {
        return {}
    }
    ,
    TabsDictionary : {
        'lessons' : {
            key: 'lessons',
            name: 'Lessons',
            content: function() { return Lessons },
            async : function(update, props) {
                update({
                    status: 'success',
                    lessons: props.course.lessons,
                    lesson: props.lesson || props.course.lessons[0]
                });
            }
        }
        ,
        'calendar' : {
            key: 'calendar',
            name: 'Calendar',
            content: function() { return Calendar },
            async: function(update, props) {
                update({
                    status: 'success',
                    embed_url: props.course.calendar_embed
                });
            }
        }
        ,
        'students' : {
            key: 'students',
            name: 'Members',
            content: function() { return Members },
            endpoint: function(props) {
                return props.course.url + '/students'
            }
        }
        ,
        'attendances' : {
            key: 'attendances',
            name: 'Attendance',
            content: function() { return Attendances },
            endpoint: function(props) {
                return props.course.url + '/attendances'
            }
        }
        ,
        'website' : {
            key:'website',
            name: 'My Website',
            content: function() { return Website },
            async: function(update, props) {
                update({
                    status: 'success',
                    user: props.user
                });
            }
        }
    }
    ,
    render : function() {
        var tabs, primary, active, tabNames = {};
        for(var key in this.TabsDictionary) {
            tabNames[key] = this.TabsDictionary[key].name;
        }

        tabs = Tabs(
                _.extend(
                    { 
                        active: this.state.active,
                        setActive : this.setActive,
                        tabNames: tabNames
                    },
                    this.props
                )
            );

        if(this.state.active) {
            primary = Primary(
                    _.extend(
                        {},
                        this.props,
                        {
                            tab : this.TabsDictionary[this.state.active],
                            response : this.state.response,
                            handleResponse : this.handleResponse,
                            updateResponse : this.updateResponse
                        }
                    )
                );
        }

        return React.DOM.div(null
                , tabs
                , primary
            );
    }
    ,
    handleResponse : function(response) {
        this.setState({ response: response });
    }
    ,
    updateResponse : function(data) {
        this.setState({
            response: _.extend({}, this.state.response, data)
        });
    }
    ,
    // Set active tab
    // @param [String] key - The tab's key
    setActive : function(key) {
        this.setState({ active : key, response: null });
    }
});
Gateway = React.createFactory(Gateway);
