var FeedbackData = React.createClass({
    displayName: 'FeedbackData'
    ,
    mixins: [SortMixin]
    ,
    getDefaultProps: function() {
        return {
            feedbacks: [],
            missing: [],
            feedbacksSortDirection: true
        };
    }
    ,
    render: function() {
        var feedbacks, thead, rows, missing;

        thead = React.DOM.thead(null
                    , React.DOM.tr(null
                        , React.DOM.th({ onClick: this.sort }, 'student_name')
                        , React.DOM.th({ onClick: this.sort }, 'comprehension')
                        , React.DOM.th({ onClick: this.sort }, 'engagement')
                        , React.DOM.th({ onClick: this.sort }, 'pace')
                        , React.DOM.th({ onClick: this.sort }, 'quality')
                    )
                );

        if(this.props.feedbacksSort) {
            feedbacks = this.props.feedbacks.sort(
                                        this.comparator(
                                            this.props.feedbacksSort,
                                            this.props.feedbacksSortDirection
                                        )
                                    );
        }
        else {
            feedbacks = this.props.feedbacks;
        }

        rows = feedbacks.map(function(a, i) {
            return [
                    React.DOM.tr(
                        {
                            key: i,
                            className: 'main'
                        }
                        , React.DOM.td({ className: 'user' }
                            , (a.student.avatar ? React.DOM.img({src: a.student.avatar }) : null)
                            , React.DOM.div(null, a.student.name)
                        )
                        , React.DOM.td({ className: 'data' }
                            , React.DOM.div({ className: 'scale-' + a.comprehension }, a.comprehension)
                        )
                        , React.DOM.td({ className: 'data' }
                            , React.DOM.div({ className: 'scale-' + a.engagement }, a.engagement)
                        )
                        , React.DOM.td({ className: 'data' }
                            , React.DOM.div({ className: 'scale-pace-' + a.pace }, a.pace)
                        )
                        , React.DOM.td({ className: 'data' }
                            , React.DOM.div({ className: 'scale-' + a.quality }, a.quality)
                        )
                    )
                    , React.DOM.tr({ className: 'essays' }
                        , React.DOM.td({ colSpan: 5 }
                            , this.renderTextResponse(a, 'comments')
                            , this.renderTextResponse(a, 'learned')
                            , this.renderTextResponse(a, 'questions')
                        )
                    )
                ];
        }, this);

        if(this.props.missing.length > 0) {
            missing = React.DOM.p(null
                        , this.props.missing.length + ' missing: ' + this.props.missing.join(', ')
                    );
        }

        return React.DOM.div(null
            , React.DOM.p(null
                , (this.props.feedbacks.length + ' of ' + this.props.total_members + ' total. ')
            )
            , missing
            , React.DOM.table({ id: 'feedback-data' }
                    , thead
                    , React.DOM.tbody(null, rows)
            )
        );
    }
    ,
    renderTextResponse : function(data, name) {
        if(data[name] === '') {
            return null;
        }
        else {
            return React.DOM.div(null
                    , React.DOM.strong(null, name)
                    , React.DOM.pre(null, data[name])
            )
        }
    }
    ,
    // Sort rows by a given attribute
    sort : function(event) {
        event.preventDefault();

        this.props.updateResponse({
            feedbacksSort: event.target.innerHTML,
            feedbacksSortDirection: !this.props.feedbacksSortDirection
        });
    }
});
FeedbackData = React.createFactory(FeedbackData);
