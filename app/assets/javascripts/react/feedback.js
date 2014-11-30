function autosaveStatusIcon(status) {
    var classes = ['autosave'],
        icon = []
    ;

    if(status === 'ok') {
        icon.push(
            React.DOM.svg({ viewBox: '0 0 16 16'}
                , React.DOM.path({ d: "M8 0c-4.418 0-8 3.582-8 8s3.582 8 8 8 8-3.582 8-8-3.582-8-8-8zm3 4.594l1.406 1.406-5.406 5.406-3.406-3.406 1.406-1.406 2 2 4-4z" })
            )
        );
        icon.push("saved!");
    }
    else {
        classes.push('error');

        icon.push(
            React.DOM.svg({ viewBox: '0 0 100 100' }
                , React.DOM.path({ d: "M96.285,87.674L54.799,15.818c-2.718-4.709-7.167-4.709-9.886,0L3.427,87.674c-2.718,4.71-0.494,8.562,4.944,8.562h82.972   C96.779,96.236,99.004,92.384,96.285,87.674z M49.98,83.335h-0.062c-2.667,0-4.652-1.983-4.652-4.899   c0-2.79,1.985-4.837,4.714-4.837c2.729,0,4.714,2.047,4.714,4.837C54.694,81.352,52.709,83.335,49.98,83.335z M54.322,48.544   c-1.178,6.636-2.109,13.334-3.039,20.465c-0.186,0.744-2.729,0.808-2.854,0c-0.929-7.131-1.921-13.829-3.101-20.465   c-0.372-2.356-0.558-3.474-0.558-4.527c0-1.489,1.055-2.667,5.086-2.667h0.061c3.846,0,5.024,1.178,5.024,2.667   C54.942,45.07,54.694,46.188,54.322,48.544z" })
            )
        );
        icon.push("There was a problem!");
    }

    return React.DOM.div({ className : classes.join(' ') }, icon);
}

var debouncedUpdate = debounce(function(name, value) {
    this.update(name, value);
}, 350);

var Feedback = React.createClass({
    displayName: 'Feedback'
    ,
    getDefaultProps: function() {
        return {
            feedback: {}
            ,
            autosave: {}
            ,
            questions: [
                {
                    name: 'engagement',
                    question: 'How engaged were you during the lesson?',
                    data : [
                          'Not engaged at all.'
                        , 'Mostly tuned out but there were a few interesting parts.'
                        , 'Neutral. I was engaged but it had more to do with my effort than the actual lesson.'
                        , 'Mostly engaged but I did tune out -- it\'s hard to pay attention for so long!'
                        , 'I was engaged the entire time.'
                    ]
                }
                ,
                {
                    name: 'comprehension',
                    question: 'How well did you understand this lesson\'s content?',
                    data : [
                          'This lesson might as well have been in another language.'
                        , 'This lesson was pretty hard and I understood very little.'
                        , 'I think I got it...'
                        , 'I understood almost everything.'
                        , 'I fully understood everything!'
                    ]
                }
                ,
                {
                    name: 'pace',
                    question: 'How slow/fast did this lesson\'s pace feel to you?',
                    data : [
                          'This lesson was way too slow! I got bored.'
                        , 'This lesson could have been a little faster.'
                        , 'This lesson was the perfect pace for me.'
                        , 'This lesson could have been a little slower.'
                        , 'This lesson was way too fast! I was not able to keep up.'
                    ]
                }
                ,
                {
                    name: 'quality',
                    question: 'What did you think of lesson overall?',
                    data : [
                          'This lesson provided no value to me.'
                        , 'This lesson could have been a lot better.'
                        , 'This lesson was ok.'
                        , 'This lesson was good -- It provided a lot of value to me.'
                        , 'This lesson was fantastic! Let me buy you a beer.'
                    ]
                }
            ]
            ,
            textareas : [
                {
                    name: 'comments',
                    question: 'Any comments you would like to add?'
                }
                ,
                {
                    name: 'learned',
                    question: '3+ things you learned (separate by blank lines please)'
                }
                ,
                {
                    name: 'questions',
                    question: 'Any questions you still on the material?'
                }
            ]
        };
    }
    ,
    render: function() {
        var questions = [],
            count = 0
        ;
        for(var key in this.props.feedback) { count++ }

        // hack to only build if the user's feedback has been loaded.
        if(count > 0) {
            this.props.questions.forEach(function(question) {
                var nodes = question.data.map(function(q, i) {
                    var autosave;
                    if (this.props.autosave[question.name] && this.props.feedback[question.name] === i+1) {
                        autosave = autosaveStatusIcon(this.props.autosave[question.name]);
                    }

                    return React.DOM.li({
                            className: ((this.props.feedback[question.name] === i+1) ? 'active' : null)
                            , onClick : this.update.bind(this, question.name, (i+1))
                        }
                        , React.DOM.div({ className: 'num' }, (i+1).toString())
                        , React.DOM.div(null, q)
                        , autosave
                    )
                }, this);
                questions.push(
                    React.DOM.div({ className: 'question' }
                               , React.DOM.h4(null, question.question)
                               , React.DOM.ul({ className: 'multiple-choice'}, nodes)
                            )
                );

            }, this);

            this.props.textareas.forEach(function(textarea) {
                var autosave;
                if (this.props.autosave[textarea.name]) {
                    autosave = autosaveStatusIcon(this.props.autosave[textarea.name]);
                }

                questions.push(
                    React.DOM.div({ className: 'question' }
                               , React.DOM.h4(null, textarea.question, autosave)
                               , React.DOM.textarea({
                                    defaultValue: this.props.feedback[textarea.name]
                                    , onChange: this.updateTextarea.bind(this, textarea.name)
                                })
                            )
                );
            }, this);
        }

        return React.DOM.div({ className: 'questions-wrap' }, questions);
    }
    ,
    updateTextarea : function(name, event) {
        debouncedUpdate.call(this, name, event.target.value);
    }
    ,
    // Update feedback data on the server and notify parent component.
    update : function(name, value) {
        this.props.feedback[name] = value;

        this.props.updateTabContent({ feedback: this.props.feedback });
        var data = { authenticity_token: MK.CSRFTOKEN, feedback: {} };
        data.feedback[name] = this.props.feedback[name];

        var autosave = {}, self=this;
        $.ajax({
            type : "PUT",
            url: '/feedbacks/' + this.props.feedback.id,
            data: data,
            dataType: "JSON"
        })
        .done(function(rsp) {
            autosave[name] = 'ok';
            self.props.updateTabContent({ autosave: autosave });
        })
        .error(function(rsp) {
            autosave[name] = 'error';
            self.props.updateTabContent({ autosave: autosave });
        })
    }
});
Feedback = React.createFactory(Feedback);
