<div class="form-group fieldcontain ${hasErrors(bean: bean, field: 'property', 'error')}<g:if test="${required}">required</g:if>">
    <g:render template="/_fields/labelTemplate"/>
    <div>
        <g:field type="number"  name="${property}" id="${property}" value="${value}" />
    </div>

</div>