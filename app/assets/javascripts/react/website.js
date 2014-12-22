var Website = React.createClass({
    displayName: 'Website'
    ,
    mixins : [ContentMixin]
    ,
    getDefaultProps: function() {
        return { pending: false };
    }
    ,
    render: function() {
        var primary, button, response;

        button = React.DOM.div({
                        className: this.props.pending ? 'submit-wrap disabled' : 'submit-wrap'
                    }
                    , React.DOM.button({
                            onClick: this.handleSubmit,
                            disabled: this.props.pending
                        }
                        ,
                        'Publish'
                    )
                    , this.props.pending ? StatusMessage.loading() : null
                    , React.DOM.span({ className: 'pending' }, 'Patience, this may take a while...')
                );

        if (this.props.content) {
            if (this.props.loaded === 'error') {
                response = StatusMessage.error(this.props.content);
            }
            else {
                response = React.DOM.div({ className: 'success'}
                    , 'Success! Your website has been published to: '
                    , React.DOM.a({ href: this.props.content.endpoint, target: '_blank' }
                        , this.props.content.endpoint
                    )
                )
            }
        }

        primary = React.DOM.div({ className: 'website-wrap' }
            , React.DOM.h3(null, 'My Website')
            , React.DOM.div(null
                , React.DOM.a({
                        className: 'website-link',
                        href: this.props.user.website,
                        target: '_blank'
                    }
                    , this.props.user.website
                )
            )
            , React.DOM.div({ className: 'info' }
                , 'Place all website files in: '
                , React.DOM.span({ className: 'path' }, 'Dropbox/Apps/makeist/website')
                , React.DOM.p(null
                    , 'Ensure Dropbox is runnning and that it finishes syncing whenever you add files.'
                    , " Now you're ready to hit publish!"
                )
            )
            , button
            , response
        );

        return this.wrapContent(primary);
    }
    ,
    handleSubmit : function() {
        var updateResponse = this.props.updateResponse;

        updateResponse({ pending: true, content: null });

        $.ajax({
            type : "PUT",
            url: "/users/" + this.props.user.id + "/website",
            data: {
                authenticity_token: this.props.CSRFTOKEN
            },
            dataType: "JSON"
        })
        .done(function(rsp) {
            updateResponse({
                pending: false,
                content: rsp
            });
        })
        .error(function(xhr) {
            var content = {
                status: xhr.status,
                error: xhr.statusText
            }
            if(xhr.responseJSON) {
                content.error = xhr.responseJSON.error;
            }

            updateResponse({
                pending: false,
                loaded: 'error',
                content: content
            });
        })
    }
});
Website = React.createFactory(Website);
