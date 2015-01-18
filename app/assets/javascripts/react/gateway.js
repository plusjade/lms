var Gateway = React.createClass({
    displayName: 'Gateway'
    ,
    propTypes : {
        course : React.PropTypes.object.isRequired,
        user : React.PropTypes.object.isRequired,
        CSRFTOKEN : React.PropTypes.string.isRequired
    }
    ,
    componentDidMount : function() {
        // Setup routing
        this.props.router.on(
            'courses/:id', this.setLesson.bind(null, null)
        );
        this.props.router.on(
            'courses/:id/lessons', this.setLesson.bind(null, null)
        );
        this.props.router.on(
            'courses/:id/students', this.setActive.bind(null, 'students')
        );
        this.props.router.on(
            'courses/:id/attendances', this.setActive.bind(null, 'attendances')
        );
        this.props.router.on(
            'courses/:id/calendar', this.setActive.bind(null, 'calendar')
        );
        this.props.router.on(
            'courses/:id/website', this.setActive.bind(null, 'website')
        );
        this.props.router.on(
            'lessons/:id', this.setLesson
        );

        this.props.router.init();
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
                    lessons: props.course.lessons
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
                        _.omit(this.state, 'active'),
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
    ,
    // Set a particular lesson
    setLesson : function(id) {
        var lesson = id
                    ? _.findWhere(this.props.course.lessons, { id: id })
                    : this.props.bootStrappedLesson

        this.setState({
            active: 'lessons',
            lesson: lesson
        });
    }
});
Gateway = React.createFactory(Gateway);
