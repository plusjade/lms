var Lesson = React.createClass({
    displayName: 'Lesson'
    ,
    getDefaultProps: function() {
        return {
            lesson : {}
        };
    }
    ,
    render: function() {
        var tabs = [], dict = [];

        dict = {
            'materials' : {
                key: 'materials',
                name: 'Materials',
                content : function() { return Materials },
                async : function(props) {
                    return '/lessons/' + props.lesson.id + '/materials'
                }
            }
            ,
            'feedback' : {
                key: 'feedback',
                name: 'My Feedback',
                content : function() { return Feedback },
                async : function(props) {
                    return '/students/' + MK.USER.id + '/lessons/' + props.lesson.id + '/feedback'
                }
            }
            ,
            'feedbacks' : {
                key: 'feedbacks',
                name: 'Feedback Data',
                content : function() { return FeedbackData },
                async : function(props) {
                    return '/lessons/' + props.lesson.id + '/feedbacks'
                }
            }
            ,
            'attendances' : {
                key: 'attendances',
                name: 'Attendance',
                content : function() { return Attendance },
                async : function(props) {
                    return '/lessons/' + props.lesson.id + '/attendances'
                }
            }
        }

        tabs.push('materials');

        switch(MK.USER.type) {
            case 'Student':
                tabs.push('feedback');
                break;
            case 'Teacher':
                tabs.push('feedbacks', 'attendances');
                break;
        };

        return React.DOM.div(null
                        , SubTabs(_.extend({ tabs: tabs, dict: dict }, this.props))
                );
    }
});
Lesson = React.createFactory(Lesson);
