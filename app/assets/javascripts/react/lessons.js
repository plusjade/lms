var Lessons = React.createClass({
    displayName: 'Lessons'
    ,
    getDefaultProps: function() {
        return { lessons: [] };
    }
    ,
    render: function() {
        var list, nodes, lessonView, defaultValue;

        nodes = this.props.lessons.map(function(a, i) {
            if (this.props.lesson && a.id === this.props.lesson.id) {
                defaultValue = i;
            }

            return React.DOM.option({
                        key: a.id,
                        value: i
                    }
                    , 'Lesson ' + a.lesson + ' ' + a.date_human
                )
        }, this);

        list = React.DOM.select({
                    className: 'lessons',
                    onChange: this.loadLesson,
                    defaultValue: defaultValue
                }
                , nodes
        );

        if(this.props.lesson) {
            lessonView = Lesson(
                                _.extend({
                                    _key : this.props.lesson.id,
                                    updateTabContent: this.updateTabContent
                                }, this.props)
                        );
        }

        return React.DOM.div(null
                , list
                , lessonView
        );
    }
    ,
    loadLesson: function(event) {
        var index = event.target.value*1;
        if(this.props.lessons[index]) {
            this.updateTabContent({ lesson : this.props.lessons[index] });
        }
    }
    ,
    // This top-level tab is responsible for all changes to its children.
    // All tab children including sub-tabs should provide changes to this callback.
    // Note we scope the data payload to the Tab namespace.
    updateTabContent : function(data) {
        MK.Nav.setState({ lessons : _.extend({}, this.props, data) });
    }
});
Lessons = React.createFactory(Lessons);
