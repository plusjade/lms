var Lessons = React.createClass({
    displayName: 'Lessons'
    ,
    getDefaultProps: function() {
        return { lessons: [] };
    }
    ,
    render: function() {
        var list, nodes, lessonView, head;

        nodes = this.props.lessons.map(function(a, i) {
            var content = [];
            if (this.props.lesson && a.id === this.props.lesson.id) {
                content.push(
                    React.DOM.svg({ viewBox: '0 0 16 16'}
                        , React.DOM.path({ d: "M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm3 4.594l1.406 1.406-5.406 5.406-3.406-3.406 1.406-1.406 2 2 4-4z" })
                ));
            }
            content.push('Lesson ' + a.lesson + ' ' + a.date_human);

            return React.DOM.li({
                        key: a.id,
                        onClick: this.loadLesson.bind(this, i)
                    }
                    , content
                )
        }, this);

        list = React.DOM.div({
                    className: 'lessons-list-wrap'
                }
                , React.DOM.ul(null, nodes)
        );

        if(this.props.lesson) {
            head = React.DOM.h3({
                            onClick : this.toggle
                        }
                        , 'Lesson ' + this.props.lesson.lesson + ' ' + this.props.lesson.date_human
                        , React.DOM.svg({ viewBox: '0 0 40 40' }
                                    , React.DOM.path({
                                        transform: 'rotate(180 20 20)',
                                        d: "M22.8,10.4L20,7.6l-2.8,2.8H9.5l0,22h21l0-22H22.8z M26.5,28.4h-13  v-2h13V28.4z M26.5,22.4h-13v-2h13V22.4z M26.5,16.4h-13v-2h13V16.4z"
                                    })
                        )
            );


            lessonView = Lesson(
                                _.extend({
                                    _key : this.props.lesson.id,
                                    updatePrimaryContent: this.updatePrimaryContent
                                }, this.props)
                        );
        }

        return React.DOM.div({
                    id: 'lessons-dropdown',
                    className: (this.props.dropdown ? 'active' : null)
                }
                , head
                , list
                , lessonView
        );
    }
    ,
    loadLesson: function(index) {
        if(this.props.lessons[index]) {
            this.updatePrimaryContent({
                lesson : this.props.lessons[index],
                dropdown: false
            });
        }
    }
    ,
    toggle : function() {
        this.props.dropdown = !this.props.dropdown;
        this.updatePrimaryContent(this.props);

    }
    ,
    updatePrimaryContent : function(data) {
        MK.Nav.setState({ content : _.extend({}, this.props, data) });
    }
});
Lessons = React.createFactory(Lessons);
