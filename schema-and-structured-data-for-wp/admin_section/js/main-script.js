var saswp_attached_rv  = [];  
var saswp_attached_col = [];  
var rmv_boolean        = false;
var rmv_html           = '';


jQuery(document).ready(function($){
  
  jQuery(".saswpforwp-colorpicker").wpColorPicker(); // Color picker
  jQuery(".saswp-onclick-show").hide();
//edit Schema page in show field for
  var busines_stype = $('#schema_type').find(":selected").val();
  if(busines_stype == 'local_business'){
    $(document).ready(function(){
      $(".saswp-business-type-tr").show();
    }); 
  }

// home page title start
  //add the home title name
  var homepage_title = $("#saswp_breadcrumb_home_page_title").val();
  $("#saswp_breadcrumb_home_page_title_text").val(homepage_title); 

  //update and add title 
  $('#saswp_breadcrumb_home_page_title_text').bind('keydown keyup',function (){
    var newname = $(this).val();
    $("#saswp_breadcrumb_home_page_title").val(newname); 
  });
// home page title end 

 $(document).on("click", '#saswp_loc_display_on_front', function(){ 
  
      if( $(this).is(":checked") ){
        $(".saswp-front-location-inst").removeClass('saswp_hide');        
      }else{
        $(".saswp-front-location-inst").addClass('saswp_hide');
      }
                       
});

  function saswp_get_collection_condition_list_ajax(condition){

    if(condition){

      $.ajax({
        url : ajaxurl,
        method : "GET",
        data: { 
          action: "saswp_get_select2_data", 
          type: condition,  
          q: '',                      
          saswp_security_nonce:saswp_localize_data.saswp_security_nonce
        },
        beforeSend: function(){ 

        },
        success: function(result){ 
                    
          if(result){

            var html = '';

              $.each(result, function(index, data){
                html +='<option value="'+data.id+'">'+data.text+'</option>';      
              });

              $(".saswp-collection-where-data").html('');
              $(".saswp-collection-where-data").append(html);
              saswp_select2();
          }

        },
        error: function(data){
          console.log("Failed Ajax Request");
          console.log(data);
        }
      }); 

    }

  }

  $(document).on("change", ".saswp-collection-where", function(){

    var current   = $(this);
    var condition = $(this).val();   
  
      if(condition){

        saswp_get_collection_condition_list_ajax(condition);

      }
    
  });

  $(".saswp-collection-display-method").change(function(){

    var type = $(this).val();
    
    if(type == 'shortcode'){
      $(".saswp-coll-where").addClass('saswp_hide');
      $("#saswp-motivatebox").css("display", "block");
    }else{
      $(".saswp-coll-where").removeClass('saswp_hide');
      $("#saswp-motivatebox").css("display", "none");
    }

  }).change();
  

  $(document).on("click", ".saswp-dismiss-notices", function(){
    var current = $(this);
    var notice_type = $(this).attr('notice-type');

    if(notice_type){

      $.ajax({
        type: "POST",    
        url:ajaxurl,                    
        dataType: "json",
        data:{action:"saswp_dismiss_notices",notice_type:notice_type, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
        success:function(response){        
          if(response['status'] == 't'){
            current.parent().parent().hide();
          }                                             
        },
        error: function(response){                    
        console.log(response);
        }
        }); 

    }
    
  });
  
  saswp_select2();

  $(".saswp-upgrade-to-pro").parent().attr({'href': 'https://structured-data-for-wp.com/pricing/', 'target': '_blank'});  
  
    
    $(document).on("click", '.saswp-attach-reviews', function(){ 
        
        if($(".saswp-enable-append-reviews").is(":checked")){
            tb_show(saswp_localize_data.translable_txt.attach_review, "#TB_inline??width=615&height=400&inlineId=saswp-embed-code-div");
            $(document).find('#TB_window').width(600).height(415).css({'top':'200px', 'margin-top': '0px'});
            $(".saswp-attached-rv-count").show();
        }else{
            $(".saswp-attached-rv-count").hide();
        }
               
    });
    
    $(".close-attached-reviews-popup").on('click', function(){       
       $("#TB_closeWindowButton").trigger('click');        
    });
    
    if($("#saswp_attahced_reviews").val()){
        saswp_attached_rv = JSON.parse($("#saswp_attahced_reviews").val());
    }
    if($("#saswp_attached_collection").val()){
        saswp_attached_col = JSON.parse($("#saswp_attached_collection").val());
    }
        
    $(document).on("click", ".saswp-attach-rv-checkbox", function(){
        
        var  review_id = null;        
             review_id = parseInt($(this).parent().attr('data-id'));
             
        var data_type =    $(this).parent().attr('data-type');  
             
        if($(this).is(":checked")){  
            
            if(data_type == 'review'){
                saswp_attached_rv.push(review_id);
            }
            
            if(data_type == 'collection'){
                saswp_attached_col.push(review_id);
            }
            
            
        }else{
            
            if(data_type == 'review'){
                saswp_attached_rv.splice( saswp_attached_rv.indexOf(review_id), 1 );
            }
            
            if(data_type == 'collection'){
                saswp_attached_col.splice( saswp_attached_col.indexOf(review_id), 1 );
            }
                        
        }
        
         var review     =    saswp_attached_rv.length;
         var collection =    saswp_attached_col.length;
         var rv_text    = '';  
         if(review > 0){
             rv_text += review+ ' Reviews, '
         }
         if(collection > 0){
             rv_text += collection + ' Collection'
         }
        if(!rv_text){
            rv_text = 0;
        }
         $(".saswp-attached-rv-count").text('Attached '+rv_text);
         $("#saswp_attahced_reviews").val(JSON.stringify(saswp_attached_rv));  
         $("#saswp_attached_collection").val(JSON.stringify(saswp_attached_col));  
        
    });
    
    $(".saswp-load-more-rv").on("click", function(e){
               
        var data_type   = $(this).attr('data-type');        
        var offset      = $(".saswp-add-rv-loop[data-type="+data_type+"]").length;
        var paged       = (offset/10)+1;
        
        $("#saswp-add-rv-automatic .spinner").addClass('is-active');
        
        e.preventDefault();        
        $.get(ajaxurl, 
            { action:"saswp_get_reviews_on_load",data_type:data_type, offset:offset, paged: paged, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
            
             function(response){   

             if(response['status'] == 't'){
                 
                 var html = '';
                 
                 if(response['result']){
                    
                     $.each(response['result'], function(i,e){
                          
                          var checked = '';
                          
                          if(data_type == 'review'){
                            if(saswp_attached_rv.includes(parseInt(e.saswp_review_id))){
                              checked = "checked";
                            }
                          }
                          
                          if(data_type == 'collection'){
                            if(saswp_attached_col.includes(parseInt(e.saswp_review_id))){
                              checked = "checked";
                            }
                          }
                          
                         html += '<div class="saswp-add-rv-loop" data-type="'+data_type+'" data-id="'+e.saswp_review_id+'">';

                         if(data_type == 'review'){
                             html += '<input class="saswp-attach-rv-checkbox" type="checkbox" '+checked+'>  <strong> '+e.saswp_reviewer_name+' ( Rating - '+e.saswp_review_rating+' ) <span class="saswp-g-plus"><img src="'+e.saswp_review_platform_icon+'"/></span></strong>';
                         }
                         if(data_type == 'collection'){
                              html += '<input class="saswp-attach-rv-checkbox" type="checkbox" '+checked+'>  <strong> '+e.saswp_reviewer_name+' </strong>';
                         }
                         
                         html += '</div>';
                        
                     });
                      $(".saswp-add-rv-automatic-list[data-type="+data_type+"]").append(html);                      
                 }
              
                 if(paged >= 10){
                   $(".saswp-load-more-rv[data-type="+data_type+"]").addClass('saswp_hide');
                 }
                 
                 if(response['message']){
                     
                    $(".saswp-rv-not-found[data-type="+data_type+"]").removeClass('saswp_hide');
                    $(".saswp-load-more-rv[data-type="+data_type+"]").addClass('saswp_hide');
                      
                 }
                        
             }else{
                 alert(response['message']);
             }
            
             $("#saswp-add-rv-automatic .spinner").removeClass('is-active');
             
            },'json');
       
        
    });
    
    $(".saswp-modify-schema-toggle").click(function(e){
        
        e.preventDefault();
        
        $(".saswp-modify-container").slideToggle("300");                
        
         var hiddenField = $('#saswp_enable_custom_field'),
         val = hiddenField.val();
         hiddenField.val(val === "1" ? "0" : "1");
        $(".saswp-enable-modify-schema-output").change();               
    });
    
    $(".saswp-enable-itemlist").change(function(){
        
        if($(this).is(":checked")){
            $("#saswp_item_list_tags").show();
            $(".saspw-item-list-note").show();
            
            if($("#saswp_item_list_tags").val() == 'custom'){
                $("#saswp_item_list_custom").show();
            }else{
                $("#saswp_item_list_custom").hide();
            }                            
        }else{
            $(".saspw-item-list-note").hide();
            $("#saswp_item_list_tags").hide();
            $("#saswp_item_list_custom").hide();
        }
        
    });
    
    $("#saswp_item_list_tags").change(function(){
        
        if($(this).val()  == 'custom'){
            $("#saswp_item_list_custom").show();
        }else{
            $("#saswp_item_list_custom").hide();
        }
        
    });
    
    /* Google Reviews js starts here */
    
    $(document).on("click", ".saswp-add-g-location-btn", function(e){
                
                var blocks_field = '';
                
                if($("#saswp_google_place_api_key").length){
                    
                    blocks_field = '<input class="saswp-g-blocks-field" name="sd_data[saswp_reviews_location_blocks][]" type="number" min="5" step="5" placeholder="5" disabled="disabled">';
                }else{
                    blocks_field = '<input class="saswp-g-blocks-field" name="sd_data[saswp_reviews_location_blocks][]" type="number" min="10" step="10" placeholder="10">'; 
                }
                                
                e.preventDefault();
                    var html = '';
                        html    += '<tr>'
                                + '<td style="width:12%;"><strong>'+saswp_localize_data.translable_txt.place_id+'</strong></td>'
                                + '<td style="width:15%;"><input class="saswp-g-location-field" name="sd_data[saswp_reviews_location_name][]" type="text" value=""></td>'                                
                                + '<td style="width:10%;"><strong>'+saswp_localize_data.translable_txt.language+'</strong></td>'
                                + '<td style="width:10%;"><input class="saswp-g-language-field" name="sd_data[saswp_reviews_language_name][]" type="text" value="" placeholder="nl"></td>'                                
                                + '<td style="width:10%;"><strong>'+saswp_localize_data.translable_txt.reviews+'</strong></td>'
                                + '<td style="width:10%;">'+blocks_field+'</td>'                                                            
                                + '<td style="width:10%;"><a class="button button-default saswp-fetch-g-reviews">'+saswp_localize_data.translable_txt.fetch+'</a></td>'
                                + '<td style="width:10%;"><a type="button" class="saswp-remove-review-item button">x</a></td>'
                                + '<td style="width:10%;"><p class="saswp-rv-fetched-msg"></p></td>' 
                                + '</tr>';                
                if(html){
                    $(".saswp-g-reviews-settings-table").append(html);
                }
                
            });
      
    $(document).on("click", '.saswp-fetch-g-reviews', function(){          
                                                              
              var current        = $(this);  
              var premium_status = 'free';
              current.addClass('updating-message');
                                          
              var location           = $(this).parent().parent().find('.saswp-g-location-field').val();
              var language           = $(this).parent().parent().find('.saswp-g-language-field').val();
              var blocks             = $(this).parent().parent().find('.saswp-g-blocks-field').val();
              
              var g_api              = $("#saswp_google_place_api_key").val();
              var reviews_api        = $("#reviews_addon_license_key").val();
              var reviews_api_status = $("#reviews_addon_license_key_status").val();
                                              
                if($("#saswp_google_place_api_key").length){
                    premium_status = 'free';
                }else{
                    premium_status = 'premium'; 
                }                 
                   
                if(premium_status == 'premium'){
                    
                    if(blocks > 0){
                    
                    var blocks_remainder = blocks % 10;
                                        
                        if(blocks_remainder != 0){
                            
                            current.parent().parent().find('.saswp-rv-fetched-msg').text(saswp_localize_data.translable_txt.step_in);
                            current.parent().parent().find('.saswp-rv-fetched-msg').css("color", "#988f1b");
                            current.removeClass('updating-message');
                            return false;
                            
                        }
                        
                    }else{
                        alert(saswp_localize_data.translable_txt.blocks_zero);
                        current.removeClass('updating-message');
                        return false;
                    }
                                        
                }
                
                if(location !='' && (reviews_api || g_api)){
                    $.ajax({
                                  type: "POST",    
                                  url:ajaxurl,                    
                                  dataType: "json",
                                  data:{action:"saswp_fetch_google_reviews",reviews_api_status:reviews_api_status, reviews_api:reviews_api,location:location, language:language, blocks:blocks,g_api:g_api,premium_status:premium_status, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                                  success:function(response){    
                                      if(response['status'] =='t'){
                                         current.parent().parent().find('.saswp-rv-fetched-msg').text(saswp_localize_data.translable_txt.success);
                                         current.parent().parent().find('.saswp-rv-fetched-msg').css("color", "green");
                                      }else{
                                         current.parent().parent().find('.saswp-rv-fetched-msg').text(response['message']); 
                                         current.parent().parent().find('.saswp-rv-fetched-msg').css("color", "#988f1b");
                                      }  
                                      current.removeClass('updating-message');
                                  },
                                  error: function(response){                    
                                      console.log(response);
                                  }
                                  });
                }else{
                    if(location ==''){
                        alert(saswp_localize_data.translable_txt.enter_place_id); 
                    }
                    if(g_api ==''){
                        alert(saswp_localize_data.translable_txt.enter_api_key); 
                    }
                    if(reviews_api ==''){
                        alert(saswp_localize_data.translable_txt.enter_rv_api_key); 
                    }
                   current.removeClass('updating-message');
                }
            });
    
    /* Google Reviews js ends here */
    
    /* Newletters js starts here */      
        
     if(saswp_localize_data.do_tour){
                
                   var  content = '<h3>'+saswp_localize_data.translable_txt.using_schema+'</h3>';
                        content += '<p>'+saswp_localize_data.translable_txt.do_you_want+' <b>'+saswp_localize_data.translable_txt.sd_update+'</b> '+saswp_localize_data.translable_txt.before_others+'</p>';
                        content += '<style type="text/css">';
                        content += '.wp-pointer-buttons{ padding:0; overflow: hidden; }';
                        content += '.wp-pointer-content .button-secondary{  left: -25px;background: transparent;top: 5px; border: 0;position: relative; padding: 0; box-shadow: none;margin: 0;color: #0085ba;} .wp-pointer-content .button-primary{ display:none}  #saswp_mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif; }';
                        content += '</style>';                        
                        content += '<div id="saswp_mc_embed_signup">';
                        content += '<form method="POST" accept-charset="utf-8" id="saswp-news-letter-form">';
                        content += '<div id="saswp_mc_embed_signup_scroll">';
                        content += '<div class="saswp-mc-field-group" style="    margin-left: 15px;    width: 195px;    float: left;">';
                        content += '<input type="text" name="saswp_subscriber_name" class="form-control" placeholder="Name" hidden value="'+saswp_localize_data.current_user_name+'" style="display:none">';
                        content += '<input type="text" value="'+saswp_localize_data.current_user_email+'" name="saswp_subscriber_email" class="form-control" placeholder="Email*"  style="      width: 180px;    padding: 6px 5px;">';                        
                        content += '<input type="text" name="saswp_subscriber_website" class="form-control" placeholder="Website" hidden style=" display:none; width: 168px; padding: 6px 5px;" value="'+saswp_localize_data.get_home_url+'">';
                        content += '<input type="hidden" name="ml-submit" value="1" />';
                        content += '</div>';
                        content += '<div id="mce-responses">';                                                
                        content += '</div>';
                        content += '<div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_a631df13442f19caede5a5baf_c9a71edce6" tabindex="-1" value=""></div>';
                        content += '<input type="submit" value="Subscribe" name="subscribe" id="pointer-close" class="button mc-newsletter-sent" style=" background: #0085ba; border-color: #006799; padding: 0px 16px; text-shadow: 0 -1px 1px #006799,1px 0 1px #006799,0 1px 1px #006799,-1px 0 1px #006799; height: 30px; margin-top: 1px; color: #fff; box-shadow: 0 1px 0 #006799;">';
                        content += '<p id="saswp-news-letter-status"></p>';
                        content += '</div>';
                        content += '</form>';
                        content += '</div>';

                        $(document).on("submit", "#saswp-news-letter-form", function(e){
                          e.preventDefault(); 
                          
                          var $form = $(this),
                          name = $form.find('input[name="saswp_subscriber_name"]').val(),
                          email = $form.find('input[name="saswp_subscriber_email"]').val();
                          website = $form.find('input[name="saswp_subscriber_website"]').val();                          
                          
                          $.post(saswp_localize_data.ajax_url,
                                     {action:'saswp_subscribe_to_news_letter',
                                     saswp_security_nonce:saswp_localize_data.saswp_security_nonce,
                                     name:name, email:email, website:website },
                            function(data) {
                              
                                if(data)
                                {
                                  if(data=="Some fields are missing.")
                                  {
                                    $("#saswp-news-letter-status").text("");
                                    $("#saswp-news-letter-status").css("color", "red");
                                  }
                                  else if(data=="Invalid email address.")
                                  {
                                    $("#saswp-news-letter-status").text("");
                                    $("#saswp-news-letter-status").css("color", "red");
                                  }
                                  else if(data=="Invalid list ID.")
                                  {
                                    $("#saswp-news-letter-status").text("");
                                    $("#saswp-news-letter-status").css("color", "red");
                                  }
                                  else if(data=="Already subscribed.")
                                  {
                                    $("#saswp-news-letter-status").text("");
                                    $("#saswp-news-letter-status").css("color", "red");
                                  }
                                  else
                                  {
                                    $("#saswp-news-letter-status").text("You're subscribed!");
                                    $("#saswp-news-letter-status").css("color", "green");
                                  }
                                }
                                else
                                {
                                  alert("Sorry, unable to subscribe. Please try again later!");
                                }
                            }
                          );
                        });      
                
                var setup;                
                var wp_pointers_tour_opts = {
                    content:content,
                    position:{
                        edge:"top",
                        align:"left"
                    }
                };
                                
                wp_pointers_tour_opts = $.extend (wp_pointers_tour_opts, {
                        buttons: function (event, t) {
                                button= jQuery ('<a id="pointer-close" class="button-secondary">' + saswp_localize_data.button1 + '</a>');
                                button_2= jQuery ('#pointer-close.button');
                                button.bind ('click.pointer', function () {
                                        t.element.pointer ('close');
                                });
                                button_2.on('click', function() {
                                  setTimeout(function(){ 
                                      t.element.pointer ('close');
                                 }, 3000);
                                      
                                } );
                                return button;
                        },
                        close: function () {
                                $.post (saswp_localize_data.ajax_url, {
                                        pointer: 'saswp_subscribe_pointer',
                                        action: 'dismiss-wp-pointer'
                                });
                        },
                        show: function(event, t){
                         t.pointer.css({'left':'170px', 'top':'160px'});
                      }                                               
                });
                setup = function () {
                        $(saswp_localize_data.displayID).pointer(wp_pointers_tour_opts).pointer('open');
                         if (saswp_localize_data.button2) {
                                jQuery ('#pointer-close').after ('<a id="pointer-primary" class="button-primary">' + saswp_localize_data.button2+ '</a>');
                                jQuery ('#pointer-primary').click (function () {
                                        saswp_localize_data.function_name;
                                });
                                jQuery ('#pointer-close').click (function () {
                                        $.post (saswp_localize_data.ajax_url, {
                                                pointer: 'saswp_subscribe_pointer',
                                                action: 'dismiss-wp-pointer'
                                        });
                                });
                         }
                };
                if (wp_pointers_tour_opts.position && wp_pointers_tour_opts.position.defer_loading) {
                        $(window).bind('load.wp-pointers', setup);
                }
                else {
                        setup ();
                }
                
            }
                
    /* Newletters js ends here */ 
        
    $(".saswp-tabs a").click(function(e){
        var href = $(this).attr('href');                
        var currentTab = getParameterByName('tab',href);
        if(!currentTab){
          currentTab = "general";
        }                                                                
        $(this).siblings().removeClass("nav-tab-active");
        $(this).addClass("nav-tab-active");
        if(currentTab=="premium_features" && jQuery(this).attr('data-extmgr')=='yes'){
            window.location.href = "edit.php?post_type=saswp&page=saswp-extension-manager";
        }else{
        $(".saswp-settings-form-wrap").find(".saswp-"+currentTab).siblings().hide();
        $(".saswp-settings-form-wrap .saswp-"+currentTab).show();
        window.history.pushState("", "", href);
        return false;
    }
});     
    $(".saswp-schame-type-select").select2();
    $(".saswp-schame-type-select").change(function(e){
        
        e.preventDefault();                        
        $(".saswp-custom-fields-table").html('');
        var schematype = $(this).val();                 
        
       $(".saswp-option-table-class tr").each(function(index,value){                
           if(index>0){
               $(this).hide(); 
              // $(this).find('select').attr('disabled', true);
           }                               
        });              
        if(schematype == 'TechArticle' || schematype == 'Article' || schematype == 'ScholarlyArticle' || schematype == 'Blogposting' || schematype == 'NewsArticle' || schematype == 'AnalysisNewsArticle' || schematype == 'AskPublicNewsArticle' || schematype == 'BackgroundNewsArticle' || schematype == 'OpinionNewsArticle' || schematype == 'ReportageNewsArticle' || schematype == 'ReviewNewsArticle' || schematype == 'WebPage' || schematype == 'ItemPage'){

            $(".saswp-enable-speakable").parent().parent().show();
        }else{
            $(".saswp-enable-speakable").parent().parent().hide();
        }

        if(schematype == 'Book' 
           || schematype == 'Course' 
           || schematype == 'Organization' 
           || schematype == 'CreativeWorkSeries'
           || schematype == 'MobileApplication'
           || schematype == 'ImageObject'
           || schematype == 'HowTo' 
           || schematype == 'MusicPlaylist' 
           || schematype == 'MusicAlbum'               
           || schematype == 'Recipe'
           || schematype == 'TVSeries'
           || schematype == 'SoftwareApplication'
           || schematype == 'Event'
           || schematype == 'VideoGame'
           || schematype == 'AudioObject'
           || schematype == 'VideoObject'
           || schematype == 'local_business'
           || schematype == 'Product'
           || schematype == 'Review'
           || schematype == 'VacationRental'
           || schematype == 'CriticReview'

           ){
                        
            $(".saswp-enable-append-reviews").parent().parent().show();
        }else{
            $(".saswp-enable-append-reviews").parent().parent().hide();
        }


        if(schematype == 'VideoObject'){
          $(".saswp-enable-markup-class").parent().parent().show();
        }else{
          $(".saswp-enable-markup-class").parent().parent().hide();
        }
        $("#saswp_location_meta_box").addClass('saswp_hide');
        if(schematype == 'local_business'){
          $("#saswp_location_meta_box").removeClass('saswp_hide');
         $(".saswp-option-table-class tr").eq(1).show();   
         $(".saswp-business-text-field-tr").show();
         $(".saswp-option-table-class tr").find('select').attr('disabled', false);            
         $('.select-post-type').val('show_globally').trigger('change');             
         }
         if(schematype == 'Service'){            
         $(".saswp-service-text-field-tr").show();
         $(".saswp-option-table-class tr").find('select').attr('disabled', false);
         }
         if(schematype == 'Event'){            
         $(".saswp-event-text-field-tr").show();
         $(".saswp-option-table-class tr").find('select').attr('disabled', false);
         }
         if(schematype == 'Review' || schematype == 'ReviewNewsArticle' || schematype == 'CriticReview'){            
         $(".saswp-review-text-field-tr").show();  
         $(".saswp-option-table-class tr").find('select').attr('disabled', false); 
         $(".saswp-item-reivewed-list").change();
         }
         if(schematype == 'ItemList'){  
         $(".saswp-schema-modify-section").hide();  
         $(".saswp-itemlist-text-field-tr").show();  
         $(".saswp-option-table-class tr").find('select').attr('disabled', false); 
         $(".saswp-itemlist-item-type-list").change();
         }else{
         $(".saswp-schema-modify-section").show();      
         }
         if(schematype == 'BreadCrumbs'){  
          $(".saswp-schema-modify-section").hide();  
          }else{
          $(".saswp-schema-modify-section").show();      
          }
        if(schematype == 'FAQ'){
          $(".saswp-enable-faq-markup-class").parent().parent().show();
        }else{
          $(".saswp-enable-faq-markup-class").parent().parent().hide();
        }
        if(schematype == 'Organization'){
            $(".saswp-organization-type-tr").show();
            $(".saswp-option-table-class tr").find('select').attr('disabled', false);
        }
        if(schematype == 'WebPage'){            
            $(".saswp-webpage-type-tr").show();
            $(".saswp-option-table-class tr").find('select').attr('disabled', false);
        }
         saswp_enable_rating_review();
         saswp_enable_rating_automate();
            
        $(".saswp-manual-modification").html('');    
        $('.saswp-static-container .spinner').addClass('is-active');
        $.get(ajaxurl, 
            { action:"saswp_get_manual_fields_on_ajax", schema_type:schematype, post_id: saswp_localize_data.post_id,saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
            
             function(response){   

              $('.saswp-static-container .spinner').removeClass('is-active');              
              $(".saswp-manual-modification").append(response);
              
                               saswp_schema_datepicker();
                               saswp_schema_timepicker();
                               
                               saswp_item_reviewed_call();
              
            });
            
            if(schematype == 'HowTo' || schematype == 'local_business' || schematype == 'FAQ' || schematype == 'Service' || schematype == 'qanda' || schematype == 'Course'){
                
                $(".saswp-enable-modify-schema").show();
                
            }else{
                
                $(".saswp-enable-modify-schema-output").val('automatic');
                $(".saswp-enable-modify-schema-output").change();
                $(".saswp-enable-modify-schema").hide();                                
                                                
            }
                  
    }); 
    $("#saswp_business_type").select2();
    $(".saswp-local-sub-type-2").select2();
    $("#saswp_business_type").change(function(){
            var businesstype = $  (this).val(); 
            var schematype = $(".saswp-schame-type-select").val();
            
           $(".saswp-option-table-class tr").each(function(index,value){                
               if(index>1){
                   $(this).hide(); 
                   $(this).find('.saswp-local-sub-type-2').attr('disabled', true);
               }                               
            }); 
            
            if(schematype == 'TechArticle' || schematype == 'Article' || schematype == 'ScholarlyArticle' || schematype == 'Blogposting' || schematype == 'NewsArticle' || schematype == 'AnalysisNewsArticle' || schematype == 'AskPublicNewsArticle' || schematype == 'BackgroundNewsArticle' || schematype == 'OpinionNewsArticle' || schematype == 'ReportageNewsArticle' || schematype == 'ReviewNewsArticle' || schematype == 'WebPage'){
               
                $(".saswp-enable-speakable").parent().parent().show();
            }else{
                $(".saswp-enable-speakable").parent().parent().hide();
            }
            
            if(schematype == 'Book' 
               || schematype == 'Course' 
               || schematype == 'Organization' 
               || schematype == 'CreativeWorkSeries' 
               || schematype == 'MobileApplication' 
               || schematype == 'ImageObject' 
               || schematype == 'HowTo' 
               || schematype == 'MusicPlaylist' 
               || schematype == 'MusicAlbum'               
               || schematype == 'Recipe'
               || schematype == 'TVSeries'
               || schematype == 'SoftwareApplication'
               || schematype == 'Event'
               || schematype == 'VideoGame'               
               || schematype == 'AudioObject'
               || schematype == 'VideoObject'
               || schematype == 'local_business'
               || schematype == 'Product'
               || schematype == 'Review'
               || schematype == 'VacationRental'
               
               ){
               
                $(".saswp-enable-append-reviews").parent().parent().show();
            }else{
                $(".saswp-enable-append-reviews").parent().parent().hide();
            }
            
            if(schematype == 'VideoObject'){
              $(".saswp-enable-markup-class").parent().parent().show();
            }else{
              $(".saswp-enable-markup-class").parent().parent().hide();
            }
            $("#saswp_location_meta_box").addClass('saswp_hide');
            if(schematype == 'local_business'){
                $(".saswp-"+businesstype+'-tr').show(); 
                $(".saswp-business-text-field-tr").show(); 
                $(".saswp-"+businesstype+'-tr').find('select').attr('disabled', false);   
                $("#saswp_location_meta_box").removeClass('saswp_hide');         
            } 
                          
             if(schematype == 'Review' || schematype == 'ReviewNewsArticle' || schematype == 'CriticReview'){            
                $(".saswp-review-text-field-tr").show(); 
                $(".saswp-review-text-field-tr").find('select').attr('disabled', false);
             }
              if(schematype == 'ItemList'){     
                $(".saswp-schema-modify-section").hide();  
                $(".saswp-itemlist-text-field-tr").show();  
                $(".saswp-option-table-class tr").find('select').attr('disabled', false);                 
              }else{
                $(".saswp-schema-modify-section").show();    
              }
             if(schematype == 'Event'){            
                $(".saswp-event-text-field-tr").show();
                $(".saswp-option-table-class tr").find('select').attr('disabled', false);
             }
             if(schematype == 'BreadCrumbs'){  
              $(".saswp-schema-modify-section").hide();  
              }else{
              $(".saswp-schema-modify-section").show();      
              }
            if(schematype == 'FAQ'){
              $(".saswp-enable-faq-markup-class").parent().parent().show();
            }else{
              $(".saswp-enable-faq-markup-class").parent().parent().hide();
            }
            if(schematype == 'Organization'){
                $(".saswp-organization-type-tr").show();
                $(".saswp-option-table-class tr").find('select').attr('disabled', false);
            }
            if(schematype == 'WebPage'){            
                $(".saswp-webpage-type-tr").show();
                $(".saswp-option-table-class tr").find('select').attr('disabled', false);
            }
            saswp_enable_rating_review();
            saswp_enable_rating_automate();
        }).change(); 
        
        
    //Settings page jquery starts here      
    $(".saswp-checkbox").change(function(){
        
                        var id = $(this).attr("id");
                        var current = $(this);
                                                                                                                        
                        
                  switch(id){
                      
                      case 'saswp-the-seo-framework-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-the-seo-framework").val(1);                                
                            }else{
                              $("#saswp-the-seo-framework").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-seo-press-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-seo-press").val(1);                                
                            }else{
                              $("#saswp-seo-press").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-aiosp-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-aiosp").val(1);                                
                            }else{
                              $("#saswp-aiosp").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-smart-crawl-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-smart-crawl").val(1);                                
                            }else{
                              $("#saswp-smart-crawl").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-squirrly-seo-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-squirrly-seo").val(1);                                
                            }else{
                              $("#saswp-squirrly-seo").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-wp-recipe-maker-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wp-recipe-maker").val(1);                                
                            }else{
                              $("#saswp-wp-recipe-maker").val(0);                                          
                            }
                      break;

                      case 'saswp-wpzoom-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpzoom").val(1);                                
                            }else{
                              $("#saswp-wpzoom").val(0);                                          
                            }
                      break;

                      case 'saswp-yotpo-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-yotpo").val(1);                                
                            }else{
                              $("#saswp-yotpo").val(0);                                          
                            }
                      break;

                      case 'saswp-ryviu-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-ryviu").val(1);                                
                            }else{
                              $("#saswp-ryviu").val(0);                                          
                            }
                      break;

                      case 'saswp-ultimate-blocks-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-ultimate-blocks").val(1);                                
                            }else{
                              $("#saswp-ultimate-blocks").val(0);                                          
                            }
                      break;

                      case 'saswp-starsrating-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-starsrating").val(1);                                
                            }else{
                              $("#saswp-starsrating").val(0);                                          
                            }
                      break;

                      case 'saswp-wptastyrecipe-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wptastyrecipe").val(1);                                
                            }else{
                              $("#saswp-wptastyrecipe").val(0);                                          
                            }
                      break;

                      case 'saswp-recipress-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-recipress").val(1);                                
                            }else{
                              $("#saswp-recipress").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-wp-ultimate-recipe-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wp-ultimate-recipe").val(1);                                
                            }else{
                              $("#saswp-wp-ultimate-recipe").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-zip-recipes-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-zip-recipes").val(1);                                
                            }else{
                              $("#saswp-zip-recipes").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-mediavine-create-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-mediavine-create").val(1);                                
                            }else{
                              $("#saswp-mediavine-create").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-ht-recipes-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-ht-recipes").val(1);                                
                            }else{
                              $("#saswp-ht-recipes").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-wpsso-core-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpsso-core").val(1);                                
                            }else{
                              $("#saswp-wpsso-core").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-for-wordpress-checkbox':  
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-for-wordpress").val(1);  
                          }else{
                            $("#saswp-for-wordpress").val(0);  
                          }                          
                          break;                      
                      case 'saswp-for-amp-checkbox':
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-for-amp").val(1);  
                          }else{
                            $("#saswp-for-amp").val(0);  
                          }                                           
                      break;
                      case 'saswp-for-cschema-checkbox':
                          
                          if ($(this).is(':checked')) {              
                            $("#saswp-for-cschema").val(1);  
                          }else{
                            $("#saswp-for-cschema").val(0);  
                          }                                           
                      break;
                      case 'saswp_kb_contact_1_checkbox':
                          
                        if ($(this).is(':checked')) {              
                         $("#saswp_kb_contact_1").val(1); 
                         $("#saswp_kb_telephone, #saswp_contact_type").parent().parent('li').removeClass("saswp-display-none");  
                       }else{                                                
                         $("#saswp_kb_contact_1").val(0);  
                         $("#saswp_kb_telephone, #saswp_contact_type").parent().parent('li').addClass("saswp-display-none"); 
                       }
                      break;
                      case 'saswp-logo-dimensions-check':
                          
                        if ($(this).is(':checked')) {              
                           $("#saswp-logo-dimensions").val(1);  
                           $("#saswp-logo-width, #saswp-logo-height").parent().parent('li').show();                           
                         }else{                             
                           $("#saswp-logo-dimensions").val(0);            
                           $("#saswp-logo-width, #saswp-logo-height").parent().parent('li').hide();
                         }
                      break;
                      case 'saswp_archive_schema_checkbox':
                          
                            if ($(this).is(':checked')) {              
                                $("#saswp_archive_schema").val(1);
                                $(".saswp_archive_schema_type_class").parent().parent().show();
                                $(".saswp_archive_list_type_class").parent().parent().show();
                                if($('.saswp_archive_list_type_class').val() == 'ItemList'){
                                    $(".saswp_archive_schema_type_class").parent().parent().hide();    
                                }
                              }else{
                                $("#saswp_archive_schema").val(0);           
                                $(".saswp_archive_schema_type_class").parent().parent().hide();
                                $(".saswp_archive_list_type_class").parent().parent().hide();
                              }
                      break;

                  case 'saswp_author_schema_checkbox':
                          
                            if ($(this).is(':checked')) {              
                                $("#saswp_author_schema").val(1);
                                $(".saswp_author_schema_type_class").parent().parent().show();
                              }else{
                                $("#saswp_author_schema").val(0);
                                $(".saswp_author_schema_type_class").parent().parent().hide();
                              }
                      break;
                      
                      case 'saswp_website_schema_checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp_website_schema").val(1);  
                              $("#saswp_search_box_schema").parent().parent().show();  
                            }else{
                              $("#saswp_website_schema").val(0);           
                              $("#saswp_search_box_schema").parent().parent().hide();
                            }
                      break;
                      
                      case 'saswp_search_box_schema_checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp_search_box_schema").val(1);             
                            }else{
                              $("#saswp_search_box_schema").val(0);           
                            }
                      break;

                      case 'saswp_breadcrumb_remove_cat_checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp_breadcrumb_remove_cat").val(1);             
                            }else{
                              $("#saswp_breadcrumb_remove_cat").val(0);           
                            }
                      break;

                      case 'saswp_breadcrumb_exclude_shop_checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp_breadcrumb_exclude_shop").val(1);             
                            }else{
                              $("#saswp_breadcrumb_exclude_shop").val(0);           
                            }
                      break;
                      
                      case 'saswp_breadcrumb_include_parent_cat_checkbox':
                          
                        if ($(this).is(':checked')) {              
                          $("#saswp_breadcrumb_include_parent_cat").val(1);             
                        }else{
                          $("#saswp_breadcrumb_include_parent_cat").val(0);           
                        }
                      break;
                      
                      case 'saswp_breadcrumb_schema_checkbox':
                            
                            if ($(this).is(':checked')) {              
                              $("#saswp_breadcrumb_schema").val(1);  
                              $("#saswp_breadcrumb_remove_cat").parent().parent().show(); 
                              $("#saswp_breadcrumb_exclude_shop").parent().parent().show(); 
                              $("#saswp_breadcrumb_include_parent_cat").parent().parent().show();
                              $("#saswp_breadcrumb_home_page_title_text").parent().parent().show();               
                            }else{
                              $("#saswp_breadcrumb_schema").val(0);           
                              $("#saswp_breadcrumb_remove_cat").parent().parent().hide();  
                              $("#saswp_breadcrumb_exclude_shop").parent().parent().hide();  
                              $("#saswp_breadcrumb_include_parent_cat").parent().parent().hide(); 
                              $("#saswp_breadcrumb_home_page_title_text").parent().parent().hide();  
                            }

                      break;
                                                                  
                      case 'saswp_comments_schema_checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp_comments_schema").val(1);             
                            }else{
                              $("#saswp_comments_schema").val(0);           
                            }
                      break;
                      
                      case 'saswp_remove_version_tag_checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp_remove_version_tag").val(1);             
                            }else{
                              $("#saswp_remove_version_tag").val(0);           
                            }
                      break;
                      
                      case 'saswp-compativility-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-flexmlx-compativility").val(1);             
                            }else{
                              $("#saswp-flexmlx-compativility").val(0);           
                            }
                      break;
                      
                      case 'saswp-review-module-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-review-module").val(1);
                              $('.saswp-rating-box-app-fields').removeClass('saswp_hide');             
                              $('#saswp-rtb-link').removeClass('saswp_hide');             
                            }else{
                              $("#saswp-review-module").val(0);
                              $('.saswp-rating-box-app-fields').addClass('saswp_hide');
                              $('#saswp-rtb-link').addClass('saswp_hide');           
                            }
                      break;

                      case 'saswp-stars-rating-checkbox':
                          
                            if ($(this).is(':checked')) { 
                              $(".saswp-stars-post-table").removeClass('saswp_hide');  
                              $(this).parent().parent().next().removeClass('saswp_hide');           
                              $('.saswp-rf-page-settings-container').removeClass('saswp_hide');           
                              $("#saswp-stars-rating").val(1);             
                            }else{
                              $(this).parent().parent().next().addClass('saswp_hide');
                              $(".saswp-stars-post-table").addClass('saswp_hide');
                              $('.saswp-rf-page-settings-container').addClass('saswp_hide'); 
                              $("#saswp-stars-rating").val(0);           
                            }
                      break;
                      
                      case 'saswp-kk-star-raring-checkbox':
                          
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-kk-star-raring").val(1);             
                            }else{
                              $("#saswp-kk-star-raring").val(0);           
                            }
                      break;

                      case 'saswp-rmprating-checkbox':
                          
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-rmprating").val(1);             
                            }else{
                              $("#saswp-rmprating").val(0);           
                            }
                      break;

                      case 'saswp-ratingform-checkbox':
                          
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-ratingform").val(1);             
                            }else{
                              $("#saswp-ratingform").val(0);           
                            }
                      break;

                      case 'saswp-wpdiscuz-checkbox':
                          
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpdiscuz").val(1);             
                            }else{
                              $("#saswp-wpdiscuz").val(0);           
                            }
                      break;
                      
                      case 'saswp-yet-another-stars-rating-checkbox':
                          
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-yet-another-stars-rating").val(1);             
                            }else{
                              $("#saswp-yet-another-stars-rating").val(0);           
                            }
                      break;
                      case 'saswp-simple-author-box-checkbox':
                          
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-simple-author-box").val(1);             
                            }else{
                              $("#saswp-simple-author-box").val(0);           
                            }
                      break;
                      case 'saswp-woocommerce-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-woocommerce").val(1);                              
                            }else{
                              $("#saswp-woocommerce").val(0);                                         
                            }
                      break;

                      case 'saswp_woocommerce_archive_checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp_woocommerce_archive").val(1); 
                              $(".saswp_woocommerce_archive_list_type_class").parent().parent().show();                             
                            }else{
                              $("#saswp_woocommerce_archive").val(0);  
                              $(".saswp_woocommerce_archive_list_type_class").parent().parent().hide();                                       
                            }
                      break;

                      case 'saswp-wpecommerce-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpecommerce").val(1);                              
                            }else{
                              $("#saswp-wpecommerce").val(0);                                         
                            }
                      break;
                      
                      case 'saswp-default-review-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp_default_review").val(1);                              
                            }else{
                              $("#saswp_default_review").val(0);                                         
                            }
                      break;

                      case 'saswp-single-price-product-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-single-price-product").val(1); 
                              $(".saswp-single-price-opt").parent().parent().show();                             
                            }else{
                              $("#saswp-single-price-product").val(0); 
                              $(".saswp-single-price-opt").parent().parent().hide();                                        
                            }
                      break;
                      
                      case 'saswp-extra-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-extra").val(1);             
                            }else{
                              $("#saswp-extra").val(0);           
                            }
                      break;

                      case 'saswp-enfold-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-enfold").val(1);             
                            }else{
                              $("#saswp-enfold").val(0);           
                            }
                      break;

                      case 'saswp-soledad-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-soledad").val(1);             
                            }else{
                              $("#saswp-soledad").val(0);           
                            }
                      break;

                      case 'saswp-wp-theme-reviews-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wp-theme-reviews").val(1);             
                            }else{
                              $("#saswp-wp-theme-reviews").val(0);           
                            }
                      break;
                      
                      case 'saswp-dw-question-answer-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-dw-question-answer").val(1);             
                            }else{
                              $("#saswp-dw-question-answer").val(0);           
                            }
                      break;

                      case 'saswp-wpqa-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpqa").val(1);             
                            }else{
                              $("#saswp-wpqa").val(0);           
                            }
                      break;
                      
                      case 'saswp-wp-job-manager-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wp-job-manager").val(1);             
                            }else{
                              $("#saswp-wp-job-manager").val(0);           
                            }
                      break;
                      
                      case 'saswp-yoast-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-yoast").val(1);             
                            }else{
                              $("#saswp-yoast").val(0);           
                            }
                      break;

                      case 'saswp-polylang-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-polylang").val(1);             
                            }else{
                              $("#saswp-polylang").val(0);           
                            }
                      break;
                      
                      case 'saswp-translatepress-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-translatepress").val(1);             
                            }else{
                              $("#saswp-translatepress").val(0);           
                            }
                      break;

                      case 'saswp-autolistings-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-autolistings").val(1);             
                            }else{
                              $("#saswp-autolistings").val(0);           
                            }
                      break;

                      case 'saswp-wpml-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpml").val(1);             
                            }else{
                              $("#saswp-wpml").val(0);           
                            }
                      break;

                      case 'saswp-metatagmanager-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-metatagmanager").val(1);             
                            }else{
                              $("#saswp-metatagmanager").val(0);           
                            }
                      break;

                      case 'saswp-slimseo-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-slimseo").val(1);             
                            }else{
                              $("#saswp-slimseo").val(0);           
                            }
                      break;
                     
                     case 'saswp-rankmath-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-rankmath").val(1);             
                            }else{
                              $("#saswp-rankmath").val(0);           
                            }
                      break;
                      
                      case 'saswp-taqyeem-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-taqyeem").val(1);             
                            }else{
                              $("#saswp-taqyeem").val(0);           
                            }
                      break;

                      case 'saswp-video-thumbnails-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-video-thumbnails").val(1);             
                            }else{
                              $("#saswp-video-thumbnails").val(0);           
                            }
                      break;

                      case 'saswp-featured-video-plus-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-featured-video-plus").val(1);             
                            }else{
                              $("#saswp-featured-video-plus").val(0);           
                            }
                      break;

                      case 'saswp-wp-product-review-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wp-product-review").val(1);             
                            }else{
                              $("#saswp-wp-product-review").val(0);           
                            }
                      break;
                      
                      case 'saswp-the-events-calendar-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-the-events-calendar").val(1);             
                            }else{
                              $("#saswp-the-events-calendar").val(0);           
                            }
                      break;
                      
                      case 'saswp-homeland-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-homeland").val(1);             
                            }else{
                              $("#saswp-homeland").val(0);           
                            }
                      break;

                      case 'saswp-ratency-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-ratency").val(1);             
                            }else{
                              $("#saswp-ratency").val(0);           
                            }
                      break;
                      
                      case 'saswp-wpresidence-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpresidence").val(1);             
                            }else{
                              $("#saswp-wpresidence").val(0);           
                            }
                      break;

                      case 'saswp-myhome-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-myhome").val(1);             
                            }else{
                              $("#saswp-myhome").val(0);           
                            }
                      break;

                      case 'saswp-realestate-5-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-realestate-5").val(1);             
                            }else{
                              $("#saswp-realestate-5").val(0);           
                            }
                      break;

                      case 'saswp-realestate-7-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-realestate-7").val(1);             
                            }else{
                              $("#saswp-realestate-7").val(0);           
                            }
                      break;

                      case 'saswp-stamped-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-stamped").val(1);             
                            }else{
                              $("#saswp-stamped").val(0);           
                            }
                      break;

                      case 'saswp-sabaidiscuss-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-sabaidiscuss").val(1);             
                            }else{
                              $("#saswp-sabaidiscuss").val(0);           
                            }
                      break;

                      case 'saswp-geodirectory-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-geodirectory").val(1);             
                            }else{
                              $("#saswp-geodirectory").val(0);           
                            }
                      break;

                      case 'saswp-classipress-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-classipress").val(1);             
                            }else{
                              $("#saswp-classipress").val(0);           
                            }
                      break;
                      
                      case 'saswp-realhomes-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-realhomes").val(1);             
                            }else{
                              $("#saswp-realhomes").val(0);           
                            }
                      break;
                      
                      case 'saswp-learn-press-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-learn-press").val(1);             
                            }else{
                              $("#saswp-learn-press").val(0);           
                            }
                      break;

                      case 'saswp-wplms-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wplms").val(1);             
                            }else{
                              $("#saswp-wplms").val(0);           
                            }
                      break;
                      
                      case 'saswp-learn-dash-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-learn-dash").val(1);             
                            }else{
                              $("#saswp-learn-dash").val(0);           
                            }
                      break;
                      
                      case 'saswp-lifter-lms-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-lifter-lms").val(1);             
                            }else{
                              $("#saswp-lifter-lms").val(0);           
                            }
                      break;

                      case 'saswp-senseilms-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-senseilms").val(1);             
                            }else{
                              $("#saswp-senseilms").val(0);           
                            }
                      break;
                      
                      case 'saswp-wp-event-manager-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wp-event-manager").val(1);             
                            }else{
                              $("#saswp-wp-event-manager").val(0);           
                            }
                      break;

                      case 'saswp-wp-event-solution-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wp-event-solution").val(1);             
                            }else{
                              $("#saswp-wp-event-solution").val(0);           
                            }
                      break;
                      
                      case 'saswp-events-manager-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-events-manager").val(1);             
                            }else{
                              $("#saswp-events-manager").val(0);           
                            }
                      break;
                      
                      case 'saswp-event-calendar-wd-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-event-calendar-wd").val(1);             
                            }else{
                              $("#saswp-event-calendar-wd").val(0);           
                            }
                      break;
                      
                      case 'saswp-event-organiser-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-event-organiser").val(1);             
                            }else{
                              $("#saswp-event-organiser").val(0);           
                            }
                      break;
                      
                      case 'saswp-modern-events-calendar-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-modern-events-calendar").val(1);             
                            }else{
                              $("#saswp-modern-events-calendar").val(0);           
                            }
                      break;
                      
                      case 'saswp-event-prime-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-event-prime").val(1);             
                            }else{
                              $("#saswp-event-prime").val(0);           
                            }
                      break;
                                                                 
                      case 'saswp-woocommerce-booking-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-woocommerce-booking").val(1);  
                              $("#saswp-woocommerce-booking-main").val(1); 
                            }else{
                              $("#saswp-woocommerce-booking").val(0); 
                              $("#saswp-woocommerce-booking-main").val(0); 
                            }
                      break;
                      
                      case 'saswp-woo-discount-rules-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-woo-discount-rules").val(1);  
                            }else{
                              $("#saswp-woo-discount-rules").val(0); 
                            }
                      break;
                      
                      case 'saswp-woocommerce-booking-main-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-woocommerce-booking-main").val(1);  
                              $("#saswp-woocommerce-booking").val(1); 
                            }else{
                              $("#saswp-woocommerce-booking-main").val(0);  
                              $("#saswp-woocommerce-booking").val(0);
                            }
                      break;
                      
                      case 'saswp-woocommerce-membership-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-woocommerce-membership").val(1);             
                            }else{
                              $("#saswp-woocommerce-membership").val(0);           
                            }
                      break;
                      
                      case 'saswp-defragment-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-defragment").val(1);             
                            }else{
                              $("#saswp-defragment").val(0);           
                            }
                      break;
                      
                      case 'saswp-template-builder-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-template-builder").val(1);             
                            }else{
                              $("#saswp-template-builder").val(0);           
                            }
                      break;
                      
                      case 'saswp-cooked-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-cooked").val(1);             
                            }else{
                              $("#saswp-cooked").val(0);           
                            }
                      break;
                      
                      case 'saswp-flexmlx-compativility-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-flexmlx-compativility").val(1);             
                            }else{
                              $("#saswp-flexmlx-compativility").val(0);           
                            }
                      break;
                      
                      case 'saswp-shopper-approved-review-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-shopper-approved-review").val(1);       
                              $(".saswp-s-reviews-settings-table").parent().parent().parent().show(); 
                            }else{
                              $("#saswp-shopper-approved-review").val(0);           
                              $(".saswp-s-reviews-settings-table").parent().parent().parent().hide(); 
                            }
                      break;
                      
                      case 'saswp-google-review-checkbox':
                          
                            if ($(this).is(':checked')) {
                                
                              $("#saswp-google-review").val(1); 
                              
                              if($("#saswp-google-rv-free-checkbox").length){
                               
                               $("#saswp-google-review-free").parent().parent().show();
                               
                               if($("#saswp-google-rv-free-checkbox").is(":checked")){
                                  $("#saswp_google_place_api_key").parent().parent().show();
                               }else{
                                  $("#saswp_google_place_api_key").parent().parent().hide(); 
                               }
                               }else{
                                  $("#saswp_google_place_api_key").parent().parent().show();                                  
                               } 
                                $(".saswp-g-reviews-settings-table").parent().parent().parent().show(); 
                                                                                                      
                            }else{
                                
                               $("#saswp-google-review").val(0);
                               $("#saswp_google_place_api_key").parent().parent().hide(); 
                               $(".saswp-g-reviews-settings-table").parent().parent().parent().hide(); 
                               
                               if($("#saswp-google-rv-free-checkbox").length){
                                   $("#saswp-google-review-free").parent().parent().hide();
                                   
                               }
                               
                               
                               
                               
                               
                            }
                      break;
                      
                      case 'saswp-google-rv-free-checkbox':
                          
                            if($("#saswp-google-review-checkbox").is(":checked")){
                                if ($(this).is(':checked')) {              
                              $("#saswp-google-review-free").val(1); 
                               $("#saswp_google_place_api_key").parent().parent().show();
                            }else{
                                $("#saswp-google-review-free").val(0);                    
                                $("#saswp_google_place_api_key").parent().parent().hide();
                            }
                                
                            }else{
                                $("#saswp-google-review-free").val(0);                    
                                $("#saswp_google_place_api_key").parent().parent().hide();
                            }
                          
                            
                      break;
                      
                      
                      case 'saswp-markup-footer-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-markup-footer").val(1);                                
                            }else{
                              $("#saswp-markup-footer").val(0);                                          
                            }
                      break;
                                                                  
                      case 'saswp-pretty-print-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-pretty-print").val(1);                                
                            }else{
                              $("#saswp-pretty-print").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-wppostratings-raring-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wppostratings-raring").val(1);                                
                            }else{
                              $("#saswp-wppostratings-raring").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-bbpress-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-bbpress").val(1);                                
                            }else{
                              $("#saswp-bbpress").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-wpforo-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpforo").val(1);                                
                            }else{
                              $("#saswp-wpforo").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-microdata-cleanup-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-microdata-cleanup").val(1);                                
                            }else{
                              $("#saswp-microdata-cleanup").val(0);                                          
                            }
                      break;
                      
                      case 'saswp-other-images-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-other-images").val(1);                                
                            }else{
                              $("#saswp-other-images").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-archive-images-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-archive-images").val(1);                                
                            }else{
                              $("#saswp-archive-images").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-full-heading-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-full-heading").val(1);                                
                            }else{
                              $("#saswp-full-heading").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-truncate-product-description-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-truncate-product-description").val(1);                                
                            }else{
                              $("#saswp-truncate-product-description").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-rss-feed-image-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-rss-feed-image").val(1);                                
                            }else{
                              $("#saswp-rss-feed-image").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-default-videoobject-checkbox':
                          
                            if ($(this).is(':checked')) {
                              $("#saswp-default-videoobject").val(1);
                            }else{
                              $("#saswp-default-videoobject").val(0);
                            }
                            
                      break;

                      case 'saswp-image-resizing-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-image-resizing").val(1);                                
                            }else{
                              $("#saswp-image-resizing").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-multiple-size-image-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-multiple-size-image").val(1);                                
                            }else{
                              $("#saswp-multiple-size-image").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-easy-testimonials-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-easy-testimonials").val(1);                                
                            }else{
                              $("#saswp-easy-testimonials").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-brb-checkbox':
                          
                            if ($(this).is(':checked')) {
                              $("#saswp-brb").val(1);                                
                            }else{
                              $("#saswp-brb").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-testimonial-pro-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-testimonial-pro").val(1);                                
                            }else{
                              $("#saswp-testimonial-pro").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-bne-testimonials-checkbox':
                          
                            if ($(this).is(':checked')) {              
                              $("#saswp-bne-testimonials").val(1);                                
                            }else{
                              $("#saswp-bne-testimonials").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-ampforwp-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-ampforwp").val(1);                                
                            }else{
                              $("#saswp-ampforwp").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-bunyadamp-checkbox':
                        saswp_compatibliy_notes(current, id); 
                         if ($(this).is(':checked')) {              
                           $("#saswp-bunyadamp").val(1);                                
                         }else{
                           $("#saswp-bunyadamp").val(0);                                          
                         }
                         
                      break;
                      
                      case 'saswp-wpreviewslider-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {                                            

                              $("#saswp-wpreviewslider").val(1);                                
                            }else{
                              $("#saswp-wpreviewslider").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-ampbyautomatic-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {                                            

                              $("#saswp-ampbyautomatic").val(1);                                
                            }else{
                              $("#saswp-ampbyautomatic").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-cmp-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {
                              $("#saswp-cmp").val(1);                                
                            }else{
                              $("#saswp-cmp").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-wpreviewpro-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {                                            

                              $("#saswp-wpreviewpro").val(1);                                
                            }else{
                              $("#saswp-wpreviewpro").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-webstories-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {                                            

                              $("#saswp-webstories").val(1);                                
                            }else{
                              $("#saswp-webstories").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-resized-image-folder-checkbox':
                      
                            var resized_id = $("#saswp-resized-image-folder-checkbox");

                            if ($(this).is(':checked')) {              

                              $.ajax({
                                type: "POST",    
                                url:ajaxurl,                    
                                dataType: "json",
                                data:{action:"saswp_create_resized_image_folder", saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                                success:function(response){   
                                  
                                  if(response.status == 't'){
                                    $("#saswp-resized-image-folder").val(1);
                                    $("#saswp-resized-image-folder-checkbox").after('<a class="saswp-clear-images button button-default">Clear Images</a>');                                  
                                  }else{
                                    resized_id.prop("checked", false);
                                    resized_id.next().text(response.message);
                                    resized_id.next().css('color', 'red');
                                  }

                                },
                                error: function(response){                    
                                    resized_id.prop("checked", false);
                                    resized_id.next().text(response);
                                    resized_id.next().css('color', 'red');
                                }
                                });
                                                                                         
                            }else{
                              $("#saswp-resized-image-folder").val(0);  
                              $(".saswp-clear-images").remove();                                        
                            }
                            
                      break;

                      case 'saswp-elementor-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-elementor").val(1);                                
                            }else{
                              $("#saswp-elementor").val(0);                                          
                            }                            
                      break;

                      case 'saswp-rannarecipe-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-rannarecipe").val(1);                                
                            }else{
                              $("#saswp-rannarecipe").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-jetpackrecipe-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-jetpackrecipe").val(1);                                
                            }else{
                              $("#saswp-jetpackrecipe").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-quickandeasyfaq-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-quickandeasyfaq").val(1);                                
                            }else{
                              $("#saswp-quickandeasyfaq").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-ultimatefaqs-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-ultimatefaqs").val(1);                                
                            }else{
                              $("#saswp-ultimatefaqs").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-ultimatemember-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-ultimatemember").val(1);                                
                            }else{
                              $("#saswp-ultimatemember").val(0);                                          
                            }
                            
                      break;
                      case 'saswp-showcaseidx-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-showcaseidx").val(1);                                
                            }else{
                              $("#saswp-showcaseidx").val(0);                                          
                            }
                            
                      break;
                      case 'saswp-realtypress-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-realtypress").val(1);                                
                            }else{
                              $("#saswp-realtypress").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-arconixfaq-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-arconixfaq").val(1);                                
                            }else{
                              $("#saswp-arconixfaq").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-faqconcertina-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-faqconcertina").val(1);                                
                            }else{
                              $("#saswp-faqconcertina").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-wpjobmanager-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpjobmanager").val(1);                                
                            }else{
                              $("#saswp-wpjobmanager").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-simplejobboard-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-simplejobboard").val(1);                                
                            }else{
                              $("#saswp-simplejobboard").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-wpjobboard-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpjobboard").val(1);                                
                            }else{
                              $("#saswp-wpjobboard").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-wpjobopenings-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpjobopenings").val(1);                                
                            }else{
                              $("#saswp-wpjobopenings").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-webfaq10-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-webfaq10").val(1);                                
                            }else{
                              $("#saswp-webfaq10").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-wpfaqschemamarkup-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpfaqschemamarkup").val(1);                                
                            }else{
                              $("#saswp-wpfaqschemamarkup").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-faqschemaforpost-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-faqschemaforpost").val(1);                                
                            }else{
                              $("#saswp-faqschemaforpost").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-masteraccordion-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-masteraccordion").val(1);                                
                            }else{
                              $("#saswp-masteraccordion").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-easyfaqs-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-easyfaqs").val(1);                                
                            }else{
                              $("#saswp-easyfaqs").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-accordion-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-accordion").val(1);                                
                            }else{
                              $("#saswp-accordion").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-html5responsivefaq-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-html5responsivefaq").val(1);                                
                            }else{
                              $("#saswp-html5responsivefaq").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-wpresponsivefaq-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpresponsivefaq").val(1);                                
                            }else{
                              $("#saswp-wpresponsivefaq").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-jolifaq-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-jolifaq").val(1);                                
                            }else{
                              $("#saswp-jolifaq").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-ameliabooking-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-ameliabooking").val(1);                                
                            }else{
                              $("#saswp-ameliabooking").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-easyaccordion-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-easyaccordion").val(1);                                
                            }else{
                              $("#saswp-easyaccordion").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-helpiefaq-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-helpiefaq").val(1);                                
                            }else{
                              $("#saswp-helpiefaq").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-mooberrybm-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-mooberrybm").val(1);                                
                            }else{
                              $("#saswp-mooberrybm").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-novelist-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-novelist").val(1);                                
                            }else{
                              $("#saswp-novelist").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-accordionfaq-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-accordionfaq").val(1);                                
                            }else{
                              $("#saswp-accordionfaq").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-schemaforfaqs-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-schemaforfaqs").val(1);                                
                            }else{
                              $("#saswp-schemaforfaqs").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-wp-customer-reviews-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wp-customer-reviews").val(1);                                
                            }else{
                              $("#saswp-wp-customer-reviews").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-total-recipe-generator-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-total-recipe-generator").val(1);                                
                            }else{
                              $("#saswp-total-recipe-generator").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-wordpress-news-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wordpress-news").val(1);                                
                            }else{
                              $("#saswp-wordpress-news").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-ampwp-checkbox':
                          
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-ampwp").val(1);                                
                            }else{
                              $("#saswp-ampwp").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-wp-event-aggregator-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wp-event-aggregator").val(1);                                
                            }else{
                              $("#saswp-wp-event-aggregator").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-timetable-event-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-timetable-event").val(1);                                
                            }else{
                              $("#saswp-timetable-event").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-xo-event-calendar-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-xo-event-calendar").val(1);                                
                            }else{
                              $("#saswp-xo-event-calendar").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-vs-event-list-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-vs-event-list").val(1);                                
                            }else{
                              $("#saswp-vs-event-list").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-calendarize-it-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-calendarize-it").val(1);                                
                            }else{
                              $("#saswp-calendarize-it").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-events-schedule-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-events-schedule").val(1);                                
                            }else{
                              $("#saswp-events-schedule").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-woo-event-manager-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-woo-event-manager").val(1);                                
                            }else{
                              $("#saswp-woo-event-manager").val(0);                                          
                            }                            
                      break;

                      case 'saswp-stachethemes-event-calendar-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-stachethemes-event-calendar").val(1);                                
                            }else{
                              $("#saswp-stachethemes-event-calendar").val(0);                                          
                            }
                            
                      break;

                      case 'saswp-all-in-one-event-calendar-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-all-in-one-event-calendar").val(1);                                
                            }else{
                              $("#saswp-all-in-one-event-calendar").val(0);                                          
                            }                            
                      break;

                       case 'saswp-event-on-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-event-on").val(1);                                
                            }else{
                              $("#saswp-event-on").val(0);                                          
                            }                            
                      break;
                      
                      case 'saswp-easy-recipe-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-easy-recipe").val(1);                                
                            }else{
                              $("#saswp-easy-recipe").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-tevolution-events-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-tevolution-events").val(1);                                
                            }else{
                              $("#saswp-tevolution-events").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-strong-testimonials-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-strong-testimonials").val(1);                                
                            }else{
                              $("#saswp-strong-testimonials").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-wordlift-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wordlift").val(1);                                
                            }else{
                              $("#saswp-wordlift").val(0);                                          
                            }
                            
                      break;
                      
                      case 'saswp-wpamp-checkbox':
                           saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-wpamp").val(1);                                
                            }else{
                              $("#saswp-wpamp").val(0);                                          
                            }
                            
                      break;
                           
                      case 'saswp-publish-press-authors-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-publish-press-authors").val(1);             
                            }else{
                              $("#saswp-publish-press-authors").val(0);           
                            }
                      break;

                        case 'saswp-easy-liveblogs-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-easy-liveblogs").val(1);                                
                            }else{
                              $("#saswp-easy-liveblogs").val(0);                                          
                            }
                      break;

                        case 'saswp-foogallery-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-foogallery").val(1);                                
                            }else{
                              $("#saswp-foogallery").val(0);                                          
                            }
                      break;

                         case 'saswp-foxizcore-checkbox':
                          saswp_compatibliy_notes(current, id); 
                            if ($(this).is(':checked')) {              
                              $("#saswp-foxizcore").val(1);                                
                            }else{
                              $("#saswp-foxizcore").val(0);                                          
                            }
                      break;
                                       
                      default:
                          break;
                  }
                             
         }).change();
        
    $("#saswp_kb_type").change(function(){
              
          var datatype = $(this).val(); 
          
          $(".saswp_org_fields, .saswp_person_fields").parent().parent().addClass('saswp_hide');
          $(".saswp_kg_logo").parent().parent().parent().addClass('saswp_hide');
          $("#sd-person-image").parent().parent().parent().addClass('saswp_hide');
          
          
          if(datatype == 'Organization'){
              
              $(".saswp_org_fields").parent().parent().removeClass('saswp_hide');
              $(".saswp_person_fields").parent().parent().addClass('saswp_hide');
              $(".saswp_kg_logo").parent().parent().parent().removeClass('saswp_hide');
              $("#sd-person-image").parent().parent().parent().addClass('saswp_hide');
          }
          if(datatype == 'Person'){
              
              $(".saswp_org_fields").parent().parent().addClass('saswp_hide');
              $(".saswp_person_fields").parent().parent().removeClass('saswp_hide');
              $(".saswp_kg_logo").parent().parent().parent().removeClass('saswp_hide');
              $("#sd-person-image").parent().parent().parent().removeClass('saswp_hide');
          }

     }).change(); 
          
    $(document).on("click", "input[data-id=media]" ,function(e) { // Application Icon upload
    e.preventDefault();
                var current = $(this);
                var button = current;
                var id = button.attr('id').replace('_button', '');                
    var saswpMediaUploader = wp.media({
      title: "Application Icon",
      button: {
        text: "Select Icon"
      },
      multiple: false,  // Set this to true to allow multiple files to be selected
                        library:{type : 'image'}
    })
    .on("select", function() {
      var attachment = saswpMediaUploader.state().get('selection').first().toJSON();                            
      
                         $("#"+id).val(attachment.url);
                         $("input[data-id='"+id+"_id']").val(attachment.id);
                         $("input[data-id='"+id+"_height']").val(attachment.height);
                         $("input[data-id='"+id+"_width']").val(attachment.width);
                         $("input[data-id='"+id+"_thumbnail']").val(attachment.url);
                         
                         if(current.attr('id') === 'sd_default_image_button'){
                             
                             $("#sd_default_image_width").val(attachment.width);
                             $("#sd_default_image_height").val(attachment.height);
                        
                         }
                         var smaller_img_notice = '';
                         if("saswp_image_div_"+id == 'saswp_image_div_sd_default_image' && attachment.height < 1200){
                              smaller_img_notice = '<p class="saswp_warning">Image size is smaller than recommended size</p>';
                         }
                         
                         $(".saswp_image_div_"+id).html('<div class="saswp_image_thumbnail"><img class="saswp_image_prev" src="'+attachment.url+'"/><a data-id="'+id+'" href="#" class="saswp_prev_close">X</a></div>'+smaller_img_notice);
                         
                         if(id == "saswp_collection_image"){
                            $(".saswp_image_div_"+id).html('<div class="saswp_image_thumbnail"><img class="saswp_image_prev" src="'+attachment.url+'" style="max-width: 100px; max-height: 100px;"/></div>'+smaller_img_notice);
                            $('.saswp-r1-aimg').each(function(i, e){
                                let imgSrc = $(this).children('img').attr('src');
                                let dataDefaultFlag = $(this).children('img').attr('data-is-default-img');
                                if(dataDefaultFlag == 0){
                                    $(this).children('img').attr('src', attachment.url);
                                }
                            }); 

                            $('.saswp-rc-a').each(function(i, e){
                                let imgSrc = $(this).children('img').attr('src');
                                let dataDefaultFlag = $(this).children('img').attr('data-is-default-img');
                                if(dataDefaultFlag == 0){
                                    $(this).children('img').attr('src', attachment.url);
                                }
                            });

                         }
                        
    })
    .open();
  });
        
    $(document).on("click", ".saswp_prev_close", function(e){
                e.preventDefault();
                
                var id = $(this).attr('data-id');                   
                $(this).parent().remove();                
                $("#"+id).val('');
                $("input[data-id='"+id+"_id']").val('');
                $("input[data-id='"+id+"_height']").val('');
                $("input[data-id='"+id+"_width']").val('');
                $("input[data-id='"+id+"_thumbnail']").val('');
                
                 if(id === 'sd_default_image'){
                             
                    $("#sd_default_image_width").val('');
                    $("#sd_default_image_height").val('');
                        
                } 
                
                
        });
        
        //Settings page jquery ends here
        
    $(document).on("click", ".saswp-modify-schema", function(e){
      
                    e.preventDefault(); 
                                                            
                    var schema_id   = $(this).attr('schema-id');

                    var current = $(this);
                    current.addClass('updating-message');

                    $.get(ajaxurl, 
                      { action:"saswp_modify_schema_post_enable",tag_ID:saswp_localize_data.tag_ID, schema_id:schema_id, post_id: saswp_localize_data.post_id,saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                       function(response){                           
                                                  
                        $(".saswp-post-specific-wrapper[data-id="+schema_id+"] .saswp-post-specific-setting").after(response);
                        $(".saswp_modify_this_schema_hidden_"+schema_id).val(1);
                        $(".saswp-ps-toggle[schema-id="+schema_id+"]").removeClass('saswp_hide');   
                        $(".saswp-restore-schema[schema-id="+schema_id+"]").parent().removeClass('saswp_hide');
                        $(".saswp-modify-schema[schema-id="+schema_id+"]").parent().addClass('saswp_hide');   

                        current.removeClass('updating-message');                        
                        saswp_schema_datepicker();
                        saswp_schema_timepicker();
                        saswp_enable_rating_review();
                        saswp_enable_rating_automate();
                        saswp_item_reviewed_call();

                      });

     });
     
     $(document).on("click", ".saswp-restore-schema", function(e){
                    e.preventDefault(); 

                    var schema_id   = $(this).attr('schema-id');

                    var current = $(this);
                    current.addClass('updating-message');

                    $.post(ajaxurl, 
                      { action:"saswp_modify_schema_post_restore", tag_ID:saswp_localize_data.tag_ID, schema_id:schema_id, post_id: saswp_localize_data.post_id,saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                       function(response){    
                        current.removeClass('updating-message');                                               

                        if(response['status']  == 't'){

                          $(".saswp_modify_this_schema_hidden_"+schema_id).val(0);                                                           
                          $(".saswp-restore-schema[schema-id="+schema_id+"]").parent().addClass('saswp_hide');
                          $(".saswp-modify-schema[schema-id="+schema_id+"]").parent().removeClass('saswp_hide');
                          $(".saswp-ps-toggle[schema-id="+schema_id+"]").remove(); 
                        
                        }else{
                          alert('Something went wrong');
                        }                        
                        
                      }, 'json');
                                       
    });

    $(document).on("change",".saswp-schema-type-toggle", function(e){
               var schema_id = $(this).attr("data-schema-id"); 
               var post_id =   $(this).attr("data-post-id");     
               var post_id =   $(this).attr("data-post-id");   
               var modified = $(".saswp_modify_this_schema_hidden_"+schema_id).val(); 
               var schema_name =   $(this).attr("data-schema-name"); 
             
               if($(this).is(':checked')){
                    var status = 0;  
                    $("."+schema_name).empty();
                    $("."+schema_name).text('Enable '+schema_name+' on this page');

                    $(".custom").empty();
                    $(".custom").text('Enable custom schema on this page');
                  
                    $(".saswp-ps-toggle[schema-id="+schema_id+"]").addClass('saswp_hide'); 
                    $(".saswp-restore-schema[schema-id="+schema_id+"]").parent().addClass('saswp_hide');
                    $(".saswp-modify-schema[schema-id="+schema_id+"]").parent().addClass('saswp_hide');

                    $("#saswp_custom_schema_field[schema-id="+schema_id+"]").parent().addClass('saswp_hide');
                              
               }else{
                    $("#saswp_custom_schema_field[schema-id="+schema_id+"]").parent().removeClass('saswp_hide');

                    $(".custom").empty();
                    $(".custom").text('Disable custom schema on this page');

                   if(modified == 1){
                    $("."+schema_name).empty();
                    $("."+schema_name).text('Disable '+schema_name+' on this page');

                    $(".saswp-ps-toggle[schema-id="+schema_id+"]").removeClass('saswp_hide'); 
                    $(".saswp-restore-schema[schema-id="+schema_id+"]").parent().removeClass('saswp_hide');
                  }else{
                    $("."+schema_name).empty();
                    $("."+schema_name).text('Disable '+schema_name+' on this page');

                    $(".saswp-modify-schema[schema-id="+schema_id+"]").parent().removeClass('saswp_hide'); 
                    $(".saswp-ps-toggle[schema-id="+schema_id+"]").addClass('saswp_hide'); 
                    $(".saswp-restore-schema[schema-id="+schema_id+"]").parent().addClass('saswp_hide');
                  } 
                   
                    var status = 1;    
               }
             $.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{
                              action:"saswp_enable_disable_schema_on_post",
                              status:status, 
                              schema_id:schema_id, 
                              post_id:post_id,
                              req_from:saswp_localize_data.req_from, 
                              saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){                                                     
                            },
                            error: function(response){                    
                            console.log(response);
                            }
                            });                                      

        });


    $(document).on("click",".saswp-reset-data", function(e){
                e.preventDefault();
             
                var saswp_confirm = confirm("Are you sure?");
             
                if(saswp_confirm == true){
                    
                $.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_reset_all_settings", saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){                               
                                setTimeout(function(){ location.reload(); }, 1000);
                            },
                            error: function(response){                    
                            console.log(response);
                            }
                            }); 
                
                }
                                                                 

        });
        
        //Licensing jquery starts here
    $(document).on("click",".saswp_license_activation", function(e){
                e.preventDefault();
                var current = $(this);
                current.addClass('updating-message');
                var license_status = $(this).attr('license-status');
                var add_on         = $(this).attr('add-on');
                var license_key    = $("#"+add_on+"_addon_license_key").val();
               
            if(license_status && add_on && license_key){
                
                $.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_license_status_check",license_key:license_key,license_status:license_status, add_on:add_on, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){                               
                               
                               $("#"+add_on+"_addon_license_key_status").val(response['status']);
                                                                
                               if(response['status'] =='active' && response['days_remaining']<0){
                                $("span.saswp_inactive_status_reviews").text('Expired');
                                $("span.saswp_inactive_status_reviews").css({ color: "red", "font-weight": "400" });
                              }
                            else if(response['status'] =='active'){  
                               $(".saswp-"+add_on+"-dashicons").addClass('dashicons-yes');
                               $(".saswp-"+add_on+"-dashicons").removeClass('dashicons-no-alt');
                               $(".saswp-"+add_on+"-dashicons").css("color", "green");
                               
                               $(".saswp_license_activation[add-on='" + add_on + "']").attr("license-status", "inactive");
                               $(".saswp_license_activation[add-on='" + add_on + "']").text("Deactivate");
                               $("span.addon-activated_reviews").css({ color: "green", "margin-left": "8px", "font-weight": "400" });                               
                               $(".saswp_license_status_msg[add-on='" + add_on + "']").text('Activated');
                               
                               $(".saswp_license_status_msg[add-on='" + add_on + "']").css("color", "green");                                
                               $(".saswp_license_status_msg[add-on='" + add_on + "']").text(response['message']);

                               $("span.inactive_status_" + add_on + "").text('Active');
                               $("span.inactive_status_" + add_on + "").css({color:"green","margin-left":"8px","font-weight":"400"});
                               $("span.inactive_status_" + add_on + "").removeClass("inactive_status_" + add_on + "").addClass("addon-activated_" + add_on + "");
                                                                                             
                              }else{
                                  
                               $(".saswp-"+add_on+"-dashicons").addClass('dashicons-no-alt');
                               $(".saswp-"+add_on+"-dashicons").removeClass('dashicons-yes');
                               $(".saswp-"+add_on+"-dashicons").css("color", "red");
                               
                               $(".saswp_license_activation[add-on='" + add_on + "']").attr("license-status", "active");
                               $(".saswp_license_activation[add-on='" + add_on + "']").text("Activate");
                               
                               $(".saswp_license_status_msg[add-on='" + add_on + "']").css("color", "red"); 
                               $(".saswp_license_status_msg[add-on='" + add_on + "']").text(response['message']);
                               $("span.addon-activated_" + add_on + "").text('Inactive');
                               $("span.addon-activated_" + add_on + "").css("color", "#bebfc0");
                               $("span.addon-activated_" + add_on + "").removeClass("addon-activated_" + add_on + "").addClass("inactive_status_" + add_on + "");
                               $("span.saswp-limit-span").css("display", "none");
                              }
                               current.removeClass('updating-message');                                                           
                               $('.saswp-note-p').text(response['message']); 
                            },
                            error: function(response){                    
                                console.log(response);
                            }
                            });
                            
            }else{
                alert('Please enter value license key');
                current.removeClass('updating-message'); 
            }

        });
        //Licensing jquery ends here

        // Start Refreshing single addon

        jQuery(document).on("click",".user_refresh_single_addon", function(e){

                var currentThis = jQuery(this);
                e.preventDefault();
                var license_status = 'active';
                var add_on         = currentThis.attr('add-on');
                var remaining_days_org         = currentThis.attr('remaining_days_org');
                var license_key    = jQuery("#"+add_on+"_addon_license_key").val();
                document.getElementById("user_refresh_" + add_on + "").classList.add("spin")
                    
                    var today = new Date();
                    function saswpreadCookie(name) {
                        var nameEQ = name + "=";
                        var ca = document.cookie.split(";");
                        for(var i=0;i < ca.length;i++) {
                            var c = ca[i];
                            while (c.charAt(0)==" ") c = c.substring(1,c.length);
                            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                        }
                        return null;
}
                    var previous_check = saswpreadCookie('saswp_addon_refresh_check');

                    previous_check = new Date(previous_check);
                    var diffDays = -1;
                    if( typeof previous_check != undefined){
                        var diffTime = Math.abs(today.getTime() - previous_check.getTime());
                        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
                    }
                    var expireDate = new Date(remaining_days_org);
                    var diffTime = Math.abs( expireDate.getTime()-today.getTime() );
                    var expireDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if( diffDays==-1 || diffDays>1 || expireDays<1 ){
                    document.cookie = "saswp_addon_refresh_check="+today;jQuery.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_license_status_check",license_key:license_key,license_status:license_status, add_on:add_on, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){
                                jQuery("#"+add_on+"_addon_license_key_status").val(response['status']);
                                document.getElementById("user_refresh_"+add_on+"").classList.remove("spin")
                                currentThis.removeClass('updating-message');
                            },
                            error: function(response){                    
                                console.log(response);
                            }
                            })
                }
                else{  
                setTimeout( function() {
                    jQuery(".dashicons").removeClass( 'spin' );}, 0 );   
                previous_check = Math.abs(previous_check.getDate()+1)+'/'+Math.abs(previous_check.getMonth()+1) +'/'+previous_check.getFullYear()+' '+previous_check.getHours()+':'+previous_check.getMinutes()+':'+previous_check.getSeconds();
                alert('Please try after '+ previous_check);
    }

        });

        // End Refreshing single addon

        // Start Refresh and check if user has done renewal in between 0-7 Days

        var ap = document.getElementById("activated-plugins-days_remaining"); 
        if (ap) {
        var remainingdays = ap.getAttribute("days_remaining");
        }
        // console.log(remainingdays)
        if ( remainingdays >= 0 && remainingdays <= 7 ){
            setTimeout(function () {
                jQuery("#refresh_license_icon_top-").trigger("click");
            }, 0);
        } 
        jQuery(document).on("click", "#refresh_license_icon_top-", function (a) {
            document.getElementById("refresh_license_icon_top").classList.add("spin"), jQuery(this);
                var current = $(this);
                var licensestatusinternal = $(this).attr("licensestatusinternal");                
                var add_on         = $(this).attr('add-on');
                // var license_key    = $("#"+add_on+"_addon_license_key").val();
                var data_attr      = $(this).attr("data-attr");
                var add_onname      = $(this).attr("add-onname");
                var license_key    = $("#"+add_on+"_addon_license_key").val();
                var license_status = 'active';
                if(add_on){
                
                $.ajax({type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_license_status_check",license_key:license_key,license_status:licensestatusinternal, add_on:add_on, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){
                                var addon_value = $("#" + add_on + "_addon_license_key_status").val()
                                if ( addon_value == 'active' ) {
                                    document.getElementById("refresh_license_icon_top").classList.remove("spin");
                                    var remaining_days = response.days_remaining;
                                    if ( remaining_days >= 0 && remaining_days <= 7){
                                    $("span.saswp-addon-alert").text("expiring in " + remaining_days + " days ");
                                }
                            }
                            else{
                                var alert = document.getElementsByClassName("saswp-addon-alert");
                                alert[0].style.color = "green";
                                var renewal = document.getElementsByClassName("renewal-license");
                                renewal[0].style.display = "none";
                                document.getElementById("refresh_license_icon_top").classList.remove("spin");
                                $("span.pro_warning").css("display","none");
                            }
                                       }                                                  
                                
                            });
                            
            }else{
                alert('Please enter value license key');
                current.removeClass('updating-message'); 
            }
            
            $.ajax({
                        type: "POST",
                        url: ajaxurl,
                        dataType: "json",
                        data: { action: "saswp_license_transient", license_key: license_key, license_key: license_key, add_on: add_on, saswp_security_nonce: saswp_localize_data.saswp_security_nonce },
                        success: function (s) {
                            JSON.parse(s);
                        },
                    });

        });

        // End Refresh and check if user has done renewal in between 0-7 Days

        // Start User manual Refresh to check if user has done renewal in After Key has expired

        var ap = document.getElementById("activated-plugins-days_remaining"); 
        if (ap) {
        var remainingdays = ap.getAttribute("days_remaining");
    }
        // console.log(remainingdays)
        if ( remainingdays >= 0 && remainingdays <= 7 ){
            setTimeout(function () {
                jQuery("#user_refresh_expired_addon-").trigger("click");
            }, 0);
        } 
        jQuery(document).on("click", "#user_refresh_expired_addon-", function (a) {
            document.getElementById("user_refresh_expired_addon").classList.add("spin"), jQuery(this);
                var current = $(this);
                var licensestatusinternal = $(this).attr("licensestatusinternal");                
                var add_on         = $(this).attr('add-on');
                // var license_key    = $("#"+add_on+"_addon_license_key").val();
                var data_attr      = $(this).attr("data-attr");
                var add_onname      = $(this).attr("add-onname");
                var license_key    = $("#"+add_on+"_addon_license_key").val();
                var license_status = 'active';
                if(add_on){
                
                $.ajax({type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_license_status_check",license_key:license_key,license_status:licensestatusinternal, add_on:add_on, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){
                                var addon_value = $("#" + add_on + "_addon_license_key_status").val()
                                if ( addon_value == 'active' ) {
                                    document.getElementById("user_refresh_expired_addon").classList.remove("spin");
                                    var remaining_days = response.days_remaining;
                                    if ( remaining_days <0 ){
                                        $("span#exp").text("Expired");
                                        location.reload();
                                }
                                else if( remaining_days >7){
                                    $("span.inner_span").text("");
                                     $("span.saswp_addon_inactive").text("");
                                      $("span.expiredinner_span").text("Your License is Active");
                                       $("span.expiredinner_span").css("color", "green");
                                        $(".renewal-license").css("display", "none");
                                         $(".saswp_addon_icon").css("display", "none");
                                }
                            }
                        }
                    });
            }else{
                alert('Please enter value license key');
                current.removeClass('updating-message'); 
            }

        });

        // End User manual Refresh to check if user has done renewal in After Key has expired

          // Start Auto Refresh and check if user has done renewal After Key has expired

        var ap = document.getElementById("activated-plugins-days_remaining"); 
        if (ap) {
        var remainingdays = ap.getAttribute("days_remaining");
    }
        
            setTimeout(function () {
                jQuery("#refresh_expired_addon-").trigger("click");
            }, 0);
         
        jQuery(document).on("click", "#refresh_expired_addon-", function (a) {
            document.getElementById("refresh_expired_addon").classList.add("spin"), jQuery(this);
                var current = $(this);
                var licensestatusinternal = $(this).attr("licensestatusinternal");                
                var add_on         = $(this).attr('add-on');
                var data_attr      = $(this).attr("data-attr");
                var add_onname      = $(this).attr("add-onname");
                var license_key    = $("#"+add_on+"_addon_license_key").val();
                var license_status = 'active';
                if(add_on){
                
                $.ajax({type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_license_status_check",license_key:license_key,license_status:licensestatusinternal, add_on:add_on, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){
                                var addon_value = $("#" + add_on + "_addon_license_key_status").val()
                                if ( addon_value == 'active' ) {
                                    document.getElementById("refresh_expired_addon").classList.remove("spin");
                                    var remaining_days = response.days_remaining;
                                    if ( remaining_days <0 ){
                                        $("span#exp").text("Expired");
                                }
                                else if( remaining_days >7){
                                    $("span.inner_span").text("");
                                     $("span.saswp_addon_inactive").text("");
                                      $("span.expiredinner_span").text("Your License is Active");
                                       $("span.expiredinner_span").css("color", "green");
                                        $(".renewal-license").css("display", "none");
                                         $(".saswp_addon_icon").css("display", "none");
                                }
                            }
                        }                                                  
                                
                            });
                            
            }else{
                alert('Please enter value license key');
                current.removeClass('updating-message'); 
            }
            
            $.ajax({
                        type: "POST",
                        url: ajaxurl,
                        dataType: "json",
                        data: { action: "saswp_expired_license_transient", license_key: license_key, license_key: license_key, add_on: add_on, saswp_security_nonce: saswp_localize_data.saswp_security_nonce },
                        success: function (s) {
                            JSON.parse(s);
                        },
                    });

        });

        // End Auto Refresh and check if user has done renewal After Key has expired
        



  //query form send starts here

    $(".saswp-send-query").on("click", function(e){
            e.preventDefault();   
            var name        = $("#saswp_query_name").val();  
            var message     = $("#saswp_query_message").val();  
            var email       = $("#saswp_query_email").val();  
            var premium_cus = $("#saswp_query_premium_cus").val(); 
            
            if($.trim(message) !='' && premium_cus && $.trim(email) !='' && saswpIsEmail(email) == true){
             $.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_send_query_message", premium_cus:premium_cus,message:message,email:email,name:name,saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){                       
                              if(response['status'] =='t'){
                                $(".saswp-query-success").show();
                                $(".saswp-query-error").hide();
                              }else{                                  
                                $(".saswp-query-success").hide();  
                                $(".saswp-query-error").show();
                              }
                            },
                            error: function(response){                    
                            console.log(response);
                            }
                            });   
            }else{
                
                if($.trim(message) =='' && premium_cus =='' && $.trim(email) ==''){
                    alert('Please enter the message, email and select customer type');
                }else{
                
                if(premium_cus ==''){
                    alert('Select Customer type');
                }
                if($.trim(message) == ''){
                    alert('Please enter the message');
                }
                if($.trim(email) == ''){
                    alert('Please enter the email');
                }
                if(saswpIsEmail(email) == false){
                    alert('Please enter a valid email');
                }
                    
                }
                
            }                        

        });
        
        //Importer from schema plugin starts here

    $(".saswp-import-plugins").on("click", function(e){
            e.preventDefault();   
            var current_selection = $(this);
            current_selection.addClass('updating-message');
            var plugin_name = $(this).attr('data-id');                      
                         $.get(ajaxurl, 
                             { action:"saswp_import_plugin_data", plugin_name:plugin_name, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                              function(response){                                  
                              if(response['status'] =='t'){                                  
                                  $(current_selection).parent().find(".saswp-imported-message").text(response['message']);
                                  $(current_selection).parent().find(".saswp-imported-message").removeClass('saswp-error');
                                   setTimeout(function(){ location.reload(); }, 2000);
                              }else{
                                  $(current_selection).parent().find(".saswp-imported-message").addClass('saswp-error');
                                  $(current_selection).parent().find(".saswp-imported-message").text(response['message']);                                  
                              }  
                              current_selection.removeClass('updating-message');
                             },'json');
        });
        
        
    $(".saswp-feedback-no-thanks").on("click", function(e){
            e.preventDefault();               
                         $.get(ajaxurl, 
                             { action:"saswp_feeback_no_thanks", saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                              function(response){                                  
                              if(response['status'] =='t'){                                  
                                 $(".saswp-feedback-notice").hide();                                 
                              }                 
                             },'json');
        });
        
    $(".saswp-feedback-remindme").on("click", function(e){
            e.preventDefault();               
                         $.get(ajaxurl, 
                             { action:"saswp_feeback_remindme", saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                              function(response){                                  
                              if(response['status'] =='t'){                                  
                                 $(".saswp-feedback-notice").hide();                                 
                              }                 
                             },'json');
        });
        
    $(document).on("change",'.saswp-local-business-type-select', function(e){
            e.preventDefault();    
                        var current = $(this);    
                        var business_type = $(this).val();
                         $.get(ajaxurl, 
                             { action:"saswp_get_sub_business_ajax", business_type:business_type, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                              function(response){    
                                  
                              if(response['status'] =='t'){ 
                                   $(".saswp-local-business-name-select").parents('tr').remove();  
                                var schema_id = current.parents('.saswp-post-specific-wrapper').attr('data-id');                                
                                var html ='<tr><th><label for="saswp_business_name_'+schema_id+'">Sub Business Type</label></th>';
                                    html +='<td><select class="saswp-local-business-name-select" id="saswp_business_name_'+schema_id+'" name="saswp_business_name_'+schema_id+'">';    
                                    $.each(response['result'], function(index, element){
                                        html +='<option value="'+index+'">'+element+'</option>';      
                                    });                                    
                                    html +='</select></td>';    
                                    html +='</tr>'; 
                                    current.parents('.form-table tr:first').after(html);
                              }else{
                                    $(".saswp-local-business-name-select").parents('tr').remove();
                              }                 
                             },'json');
        });
                    
    saswp_item_reviewed_call();
                                                
        jQuery('.saswp-local-schema-time-picker').timepicker({ 'timeFormat': 'H:i:s'});
        
        $(document).on("click",".saswp-add-custom-schema", function(e){
            
            e.preventDefault();  
            
            $(".saswp-add-custom-schema-field").removeClass('saswp_hide');
            $(this).hide();
                       
        });
        
        $(document).on("click", ".saswp-delete-custom-schema", function(e){
            
            e.preventDefault();  
            
            $("#saswp_custom_schema_field").val('');
            $(".saswp-add-custom-schema-field").addClass('saswp_hide');
            $(".saswp-add-custom-schema").show();
                                               
        });
                
        saswp_schema_datepicker();  
        saswp_schema_timepicker();
        
        saswp_reviews_datepicker();        
        
        //Review js starts here
        
        $(document).on("click", ".saswp-add-more-item",function(e){
            e.preventDefault();                        
            var html = '<tr class="saswp-review-item-tr">';
                html += '<td>Review Item Feature</td>';
                html += '<td><input type="text" name="saswp-review-item-feature[]"></td>';
                html += '<td>Rating</td>';
                html += '<td><input step="0.1" min="0" max="5" type="number" name="saswp-review-item-star-rating[]"></td>';
                html += '<td><a type="button" class="saswp-remove-review-item button">x</a></td>';
                html += '</tr>';                
                $(".saswp-review-item-list-table").append(html);
                
        });
        
        $(document).on("click", ".saswp-remove-review-item", function(e){
            e.preventDefault();        
            $(this).parent().parent('tr').remove();
       });
        
        $(document).on("focusout", ".saswp-review-item-tr input[type=number]", function(e){
            e.preventDefault();    
            var total_rating = 0;
            var element_count = $(".saswp-review-item-tr input[type=number]").length;            
            $(".saswp-review-item-tr input[type=number]").each(function(index, element){
                if($(element).val() ==''){
                  total_rating += parseFloat(0);  
                }else{
                  total_rating += parseFloat($(element).val());  
                }
                           
            });
            var over_all_rating = total_rating / element_count;
            $("#saswp-review-item-over-all").val(over_all_rating);
       });
       
        $("#saswp-review-location").change(function(){
          var location = $(this).val();
          $(".saswp-review-shortcode").addClass('saswp_hide');
          if(location == 3){  
              $(".saswp-review-shortcode").removeClass('saswp_hide');
          }                                          
        }).change();  
        
        $("#saswp-review-item-enable").change(function(){
                          if ($(this).is(':checked')) {              
                            $(".saswp-review-fields").show();  
                          }else{
                            $(".saswp-review-fields").hide();  
                          }                                        
        }).change();  
        
        $(document).on("click", ".saswp-restore-post-schema", function(e){
                    e.preventDefault(); 
                    var current = $(this);
                    current.addClass('updating-message');
            
                    if($(".saswp-post-specific-schema-ids").val()){
                        var schema_ids = JSON.parse($(".saswp-post-specific-schema-ids").val());                           
                    }
            
                         $.post(ajaxurl, 
                             { action:"saswp_restore_schema", schema_ids:schema_ids,post_id: saswp_localize_data.post_id, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                              function(response){                                  
                              if(response['status'] =='t'){                                                                    
                                   setTimeout(function(){ location.reload(); }, 1000);
                              }else{
                                  alert(response['msg']);
                                  setTimeout(function(){ location.reload(); }, 1000);
                              }  
                              current.removeClass('updating-message');
                             },'json');
        });
                
        //Review js ends here
                
        $(document).on("click","div.saswp-tab ul.saswp-tab-nav a", function(e){
            e.preventDefault();
                var attr = $(this).attr('data-id');
                $(".saswp-post-specific-wrapper").hide();            
                $("#"+attr).show();           
                $('div.saswp-tab ul.saswp-tab-nav a').removeClass('selected');
                $('div.saswp-tab ul.saswp-tab-nav li').removeClass('selected');
                $(this).addClass('selected'); 
                $(this).parent().addClass('selected'); 
            saswp_enable_rating_review();
            saswp_enable_rating_automate();
        });
        
        
        $('#saswp-global-tabs a:first').addClass('saswp-global-selected');
        $('.saswp-global-container').hide();
        
        var hash = window.location.hash;
        
        if(hash == '#saswp-default-container'){
            $('.saswp-global-container:eq(2)').show();
        }else if(hash == '#saswp-knowledge-container'){
            $('.saswp-global-container:eq(1)').show();
        }else{
            $('.saswp-global-container:first').show();
        }
        
        $('#saswp-global-tabs a').click(function(){
            var t = $(this).attr('data-id');
            
          if(!$(this).hasClass('saswp-global-selected')){ 
            $('#saswp-global-tabs a').removeClass('saswp-global-selected');           
            $(this).addClass('saswp-global-selected');

            $('.saswp-global-container').hide();
            $('#'+t).show();
         }
        });
                                        
        $('#saswp-review-tabs a:first').addClass('saswp-global-selected');
        $('.saswp-review-container').hide();
        $('.saswp-review-container:first').show();
        
        $('#saswp-review-tabs a').click(function(){
            var t = $(this).attr('data-id');
            
          if(!$(this).hasClass('saswp-global-selected')){ 
            $('#saswp-review-tabs a').removeClass('saswp-global-selected');           
            $(this).addClass('saswp-global-selected');

            $('.saswp-review-container').hide();
            $('#'+t).show();
         }
        });
        
        
        $('#saswp-compatibility-tabs a:first').addClass('saswp-global-selected');
        $('.saswp-compatibility-container').hide();
        $('.saswp-compatibility-container:first').show();
        
        $('#saswp-compatibility-tabs a').click(function(){
            var t = $(this).attr('data-id');
            
          if(!$(this).hasClass('saswp-global-selected')){ 
            $('#saswp-compatibility-tabs a').removeClass('saswp-global-selected');           
            $(this).addClass('saswp-global-selected');

            $('.saswp-compatibility-container').hide();
            $('#'+t).show();
         }
        });
        
        
        //Importer from schema plugin ends here
        
        //custom fields modify schema starts here
        
        //Changing the url of add new schema type 
        $('a[href="'+saswp_localize_data.new_url_selector+'"]').attr( 'href', saswp_localize_data.new_url_href); 
        
       
       $(".saswp-enable-modify-schema-output").on("change",function(){
           
                $(".saswp-static-container").addClass('saswp_hide');
                $(".saswp-dynamic-container").addClass('saswp_hide');
           
            if ($(this).val()  == 'manual') { 
                $(".saswp-static-container").removeClass('saswp_hide');
                $(".saswp-dynamic-container").addClass('saswp_hide');
            }            
            if ($(this).val()  == 'automatic') { 
                $(".saswp-static-container").addClass('saswp_hide');
                $(".saswp-dynamic-container").removeClass('saswp_hide');
            }
        });
        
       $(document).on('change','.saswp-custom-fields-name',function(){
                                                   
            var type = 'text';   
            var tr   = $(this).parent().parent('tr'); 
            var fields_name = $(this).val();            
            var str2 = "_image";
            var str3 = "_logo";
            if((fields_name.indexOf(str2) != -1)|| (fields_name.indexOf(str3) != -1) || (fields_name == 'saswp_video_object_thumbnail_url')){
                type = 'image';
            }                                     
             var id = $(this).parent().parent('tr').find("td:eq(1)");                                    
             saswp_get_meta_list(null,type, null, id, fields_name, tr); 
             saswp_add_schema_template_to_meta_list( fields_name, $(this) );                   
             
       }); 
                
       $(document).on("click", '.saswp-skip-button', function(e){
           e.preventDefault();
           $(this).parent().parent().hide();
           
                    $.post(ajaxurl, 
                        { action:"saswp_skip_wizard", saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                         function(response){                                  
                                    
                        },'json');
           
       }); 
                                                                                    
       $(document).on("click", ".saswp_add_schema_fields_on_fly", function(e){
           
           e.preventDefault();
           
          var current_fly = $(this); 
          
          current_fly.addClass('updating-message');
                      
          var schema_id   = $(this).attr('data-id');
          var fields_type = $(this).attr('fields_type'); 
          var div_type    = $(this).attr('div_type');          
          var schema_type = $(this).attr('itemlist_sub_type');
          var count =  $("#saswp_specific_"+schema_id+" , .saswp-"+div_type+"-table-div").length;
          var index =  $( "#saswp_specific_"+schema_id+" , .saswp-"+div_type+"-table-div").last().attr('data-id');
              index = ++index;
           
           if(!index){
               index = 0;
           }
                       
            saswp_get_post_specific_schema_fields(current_fly, index, fields_type, div_type, schema_id, fields_type+'_', schema_type);               
            
       });
       
       $(document).on("click", ".saswp-table-close", function(){
           $(this).parent().remove();
       });
       $(document).on("click", ".saswp-table-close-new", function(){
        $(this).closest('.saswp-dynamic-properties').remove();
      });
        
       //How to schema js ends here
       
       $(document).on("click", ".saswp-rmv-modify_row", function(e){
           e.preventDefault();
           $(this).parent().parent().remove();
       });
       
       $(document).on("change",".saswp-custom-meta-list", function(){
           
          var current = $(this);  
          var schema_type    = $('select#schema_type option:selected').val();
          var meta_val   = $(this).val();
          var field_name = $(this).parent().parent('tr').find(".saswp-custom-fields-name").val();
          var html       = '';
          var el_id      = schema_type.toLowerCase()+'_'+field_name;
          var media_name = 'saswp_fixed_image['+field_name+']';
          
          if(meta_val == 'manual_text'){
              html += '<td><textarea cols="35" rows="2" name="saswp_fixed_text['+field_name+']"></textarea></td>';              
              html += '<td><a class="button button-default saswp-rmv-modify_row">X</a></td>';
              
              $(this).parent().parent('tr').find("td:gt(1)").remove();
              $(this).parent().parent('tr').append(html);
              saswpCustomSelect2();
              
          }else if(meta_val == 'taxonomy_term'){
                       
                 if(!saswp_taxonomy_term['taxonomy']) {
                     
                     $.get(ajaxurl, 
                     { action:"saswp_get_taxonomy_term_list", saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                      function(response){    

                      if(response){
                          
                            saswp_taxonomy_term['taxonomy'] = response;                          
                            html += saswp_taxonomy_term_html(response, field_name);

                            current.parent().parent('tr').find("td:gt(1)").remove();
                            current.parent().parent('tr').append(html);
                            saswpCustomSelect2();
                      }

                     },'json');
                     
                 }else{
                                          
                            html += saswp_taxonomy_term_html(saswp_taxonomy_term['taxonomy'], field_name);

                            current.parent().parent('tr').find("td:gt(1)").remove();
                            current.parent().parent('tr').append(html);
                            saswpCustomSelect2();
                     
                 }     
               
          }else if(meta_val == 'custom_field'){
              html += '<td><select class="saswp-custom-fields-select2" name="saswp_custom_meta_field['+field_name+']">';
              html += '</select></td>';              
              html += '<td><a class="button button-default saswp-rmv-modify_row">X</a></td>';
              
              $(this).parent().parent('tr').find("td:gt(1)").remove();
              $(this).parent().parent('tr').append(html);
              saswpCustomSelect2();
              
          }else if(meta_val == 'fixed_image'){           
              html += '<td>';              
              html += '<fieldset>';
              html += '<input data-id="media" style="width: 30%;" class="button" id="'+el_id+'_button" name="'+el_id+'_button" type="button" value="Upload" />';
              html += '<input type="hidden" data-id="'+el_id+'_height" class="upload-height" name="'+media_name+'[height]" id="'+el_id+'_height" value="">';
              html += '<input type="hidden" data-id="'+el_id+'_width" class="upload-width" name="'+media_name+'[width]" id="'+el_id+'_width" value="">';
              html += '<input type="hidden" data-id="'+el_id+'_thumbnail" class="upload-thumbnail" name="'+media_name+'[thumbnail]" id="'+el_id+'_thumbnail" value="">';
              html += '<div class="saswp_image_div_'+el_id+'">';
              html += '</div>';
              html += '</fieldset>';                                          
              html += '</td>';              
              html += '<td><a class="button button-default saswp-rmv-modify_row">X</a></td>';
              
              $(this).parent().parent('tr').find("td:gt(1)").remove();
              $(this).parent().parent('tr').append(html);
              saswpCustomSelect2();
          }else if(meta_val == 'saswp_schema_template'){
              html += '<td><select class="saswp-schema-template-select2" name="saswp_schema_template_field['+field_name+'][]" multiple>';
              html += '</select></td>';              
              html += '<td><a class="button button-default saswp-rmv-modify_row">X</a></td>';
              $(this).parent().parent('tr').find("td:gt(1)").remove();
              $(this).parent().parent('tr').append(html);
              saswpRenderSchemaTemplates();          
          }
          else{
              html += '<td></td>';
              html += '<td><a class="button button-default saswp-rmv-modify_row">X</a></td>';
              
              $(this).parent().parent('tr').find("td:gt(1)").remove();
              $(this).parent().parent('tr').append(html);
              saswpCustomSelect2();
          }
          
           
       });
        
       $(document).on("change", ".saswp-item-reivewed-list", function(){
           
                $(".saswp-custom-fields-table").html('');
                 saswp_meta_list_fields = [];
            
                 var current = $(this);
                 var schema_type   = $('select#schema_type option:selected').val();
                                  
                 saswp_item_reviewed_ajax(schema_type, current, 'manual');
            
                                   
       }); 
        
       $(document).on("click", '.saswp-add-custom-fields', function(){
           
          var current_fly = $(this);
          current_fly.addClass('updating-message');
          var schema_type    = $('select#schema_type option:selected').val();
          var schema_subtype = '';
          var field_name     = null;
          
          if(schema_type == 'Review' || schema_type == 'CriticReview'){
              schema_subtype = $('select.saswp-item-reivewed-list option:selected').val();
              field_name  = 'saswp_review_name';
          }          
          var post_id = $('#post_ID').val();
          
          if(schema_type !=''){
                            
              if(!saswp_meta_list_fields[schema_type]){
                  
                      $.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_get_schema_type_fields",post_id:post_id, schema_type:schema_type,schema_subtype:schema_subtype, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){   
                                                                                                        
                                        saswp_meta_list_fields[schema_type] = response;                                       
                                        saswp_get_meta_list(current_fly, 'text', saswp_meta_list_fields[schema_type], null, field_name, null);                                                                     
                             
                            },
                            error: function(response){                    
                            console.log(response);
                            }
                            });
                  
                  
              }else{
                                        
                saswp_get_meta_list(current_fly, 'text', saswp_meta_list_fields[schema_type], null, field_name, null);
                                    
              }
                     
          }
       });
       saswpCustomSelect2();    
                                   
       saswpRenderSchemaTemplates();   

       saswp_enable_rating_review();   

       saswp_enable_rating_automate();                    

       saswp_enable_rating_automate();                    

     
        //custom fields modify schema ends here
        
        
        //Google review js starts here        
        
        $('a[href="'+saswp_localize_data.collection_post_add_url+'"]').attr( 'href', saswp_localize_data.collection_post_add_new_url); 
        
        
        
        $(document).on("click", '.saswp_coonect_google_place', function(){          
          
          var place_id   = $("#saswp_google_place_id").val();
          var language   = $("#saswp_language_list").val();
          var google_api = $("#saswp_googel_api").val();
          
          if(place_id !=''){
              $.ajax({
                            type: "POST",    
                            url:ajaxurl,                    
                            dataType: "json",
                            data:{action:"saswp_connect_google_place",place_id:place_id, language:language, google_api:google_api, saswp_security_nonce:saswp_localize_data.saswp_security_nonce},
                            success:function(response){    
                                console.log(response['status']);                             
                            },
                            error: function(response){                    
                                console.log(response);
                            }
                            });
          }
       });
       
        $(document).on("click", ".saswp-add-social-links", function(){
           
           var html = '<tr><td><input type="text" placeholder="https://www.facebook.com/profile" name="sd_data[saswp_social_links][]" value=""></td><td><a class="button button-default saswp-rmv-modify_row">X</a></td></tr>';
           
           $(".saswp-social-links-table").append(html);           
            
        });
                
        //google review js ends here
                                        
        //Adding settings button beside add schema type button on schema type list page       
        
        $(document).on('click', ".saswp-show-accept-rv-popup" , function(){            
             tb_show("Reviews Form", "#TB_inline??width=600&height=400&inlineId=saswp-accept-reviews-popup");
            $(document).find('#TB_window').width(600).height(400).css({'top':'100px', 'margin-top': '0px'});
            
        });
        
        if( ( saswp_localize_data.post_type == 'saswp_reviews' || saswp_localize_data.post_type == 'saswp-collections' ) && (saswp_localize_data.page_now == 'edit.php')){
            
            let is_enable_gcaptcha = '';
            let captcha_class = 'saswp_hide';
            if(saswp_localize_data.saswp_enable_gcaptcha){
                if(saswp_localize_data.saswp_enable_gcaptcha == 1){
                    is_enable_gcaptcha = 'checked';    
                    captcha_class = '';
                }
            }
            var html  = '<div class="saswp-custom-post-tab">';
            
                html += '<div style="display:none;" id="saswp-accept-reviews-popup">';
                html += '<div class="saswp-accept-rv-container">';
                html += '<p>Use Below shortcode to show reviews form in your website. Using this you can accept reviews from your website directly. <a href="https://structured-data-for-wp.com/docs/article/how-to-add-dynamic-aggregate-rating/" target="_blank">Learn More</a></p>';
                html += '<div class="saswp-show-form-on-tab"><strong>Simple Form</strong> <input value="[saswp-reviews-form]" type="text" readonly></div>';
                html += '<div class="saswp-show-form-on-tab"><strong>Show form on button tap</strong> <input value="[saswp-reviews-form onbutton=&quot;1&quot;]" type="text" readonly></div>';
                html += '<div class="saswp-show-form-on-tab"><strong>Enable reCAPTCHA v2</strong> <input name="sd_data[saswp_enable_gcaptcha]" id="saswp_enable_gcaptcha" value="1" type="checkbox" '+is_enable_gcaptcha+'></div>';
                html += '<div id="saswp-gkey-captcha-wrapper" class="'+captcha_class+'">';
                html += '<div class="saswp-show-form-on-tab"><strong>Site Key</strong> <input class="saswp-ta-left" name="sd_data[saswp_g_site_key]" id="saswp_g_site_key" value="'+saswp_localize_data.saswp_g_site_key+'" type="text"></div>';
                html += '<div class="saswp-show-form-on-tab"><strong>Secret Key</strong> <input class="saswp-ta-left" name="sd_data[saswp_g_secret_key]" id="saswp_g_secret_key" value="'+saswp_localize_data.saswp_g_secret_key+'" type="text"></div>';
                html += '</div>';
                html += '<p><strong>Note:</strong> To get SITE KEY & SECRET KEY <a target="_blank" href="https://www.google.com/recaptcha/admin/create">Click here</a> and you must choose reCAPTCHA type v2 </p>'
                html += '<div class="saswp-ar-save-btn"><input type="button" class="button button-primary" value="Save Settings" id="saswp-ar-form-btn"></div>';
                html += '</div>';
                html += '</div>';
                
                html += '<h2 class="nav-tab-wrapper">';
                html += '<a href='+saswp_localize_data.reviews_page_url+' class="nav-tab '+(saswp_localize_data.current_url == saswp_localize_data.reviews_page_url ? 'saswp-global-selected' : '' )+'">Reviews</a>';
                html += '<a href='+saswp_localize_data.collections_page_url+' class="nav-tab '+(saswp_localize_data.current_url == saswp_localize_data.collections_page_url ? 'saswp-global-selected' : '' )+'">Collections</a>';
                html += '<a class="nav-tab saswp-show-accept-rv-popup" style="cursor: pointer;">Accept Reviews</a>';
                html += '</h2>';
                
                html += '</div>';
            
            jQuery(jQuery(".wrap")).prepend(html);
            
        }
        // Offer Banner addition
        // if('saswp_reviews' == saswp_localize_data.post_type && saswp_localize_data.page_now == 'edit.php'){

        //   var offer_banner = '<a style="background: #ca4a1f;color: #fff;border-color:#ca4a1f;" target="_blank" href="http://structured-data-for-wp.com/festive-season/" class="page-title-action saswp-offer-banner">50% OFF for Limited time</a>';
        //   jQuery(jQuery(".wrap .page-title-action")).after(offer_banner);

        // }


        // if('saswp' == saswp_localize_data.post_type && saswp_localize_data.page_now == 'post.php'){

        //   var offer_banner = '<a style="background: #ca4a1f;color: #fff;border-color:#ca4a1f;" target="_blank" href="http://structured-data-for-wp.com/festive-season/" class="page-title-action saswp-offer-banner">50% OFF for Limited time</a>';
        //   jQuery(jQuery(".wrap a")[0]).after(offer_banner);

        // }
                    
          jQuery(document).on("click", ".saswp-clear-images", function(e){            

            e.preventDefault();
            var current     = $(this);
            var saswp_confirm = confirm("Are you sure? It will remove all the resized images");

            if(saswp_confirm == true){

              current.addClass('updating-message');

              $.ajax({
                type: "POST",    
                url:ajaxurl,                    
                dataType: "json",
                data:{action:"saswp_clear_resized_image_folder", saswp_security_nonce:saswp_localize_data.saswp_security_nonce },
                success:function(response){   
                  
                  current.removeClass('updating-message');

                  if(response.status != 't'){
                    alert('something went wrong')                    
                  }
                    
                },
                error: function(response){                    
                   console.log(response);
                }
                });

            }
                        
          });

        if ('saswp' == saswp_localize_data.post_type && saswp_localize_data.page_now == 'edit.php') {
        
          // Offer Banner addition

          //var offer_banner = '<a style="background: #ca4a1f;color: #fff;border-color:#ca4a1f;" target="_blank" href="http://structured-data-for-wp.com/festive-season/" class="page-title-action saswp-offer-banner">50% OFF for Limited time</a>';
          
          //jQuery(jQuery(".wrap a")[0]).after("<a href='"+saswp_localize_data.saswp_settings_url+"' id='' class='page-title-action'>Settings</a>"+offer_banner);

          jQuery(jQuery(".wrap a")[0]).after("<a href='"+saswp_localize_data.saswp_settings_url+"' id='' class='page-title-action'>Settings</a>");
         
        }
        
        //star rating stars here
            if(typeof(saswp_reviews_data) !== 'undefined'){ 
             $(".saswp-rating-div").rateYo({
              spacing: "5px",  
              rtl:saswp_localize_data.is_rtl,
              rating: saswp_reviews_data.rating_val,                           
              readOnly: saswp_reviews_data.readonly,
              onSet: function (rating, rateYoInstance) {
                    $(this).next().next().val(rating);                
                }                              
            }).on("rateyo.change", function (e, data){
              var rating = data.rating;   
                $(this).next().text(rating);
            });
                
            }                                                        
        //rating ends here
               
            $("#sd-person-phone-number, #saswp_kb_telephone").focusout(function(){
                
                var current = $(this);
                
                current.parent().find('.saswp-phone-validation').remove();   
                
                var pnumber = $(this).val();
                var p_regex = /^\+([0-9]{1,3})\)?[-. ]?([0-9]{2,4})[-. ]?([0-9]{2,4})[-. ]?([0-9]{2,4})$/;
                
                if(!p_regex.test(pnumber)){
                 current.after('<span style="color:red;" class="saswp-phone-validation">Invalid Phone Number</span>');   
                }else{
                 current.parent().find('.saswp-phone-validation').remove();   
                }
                                
            });   
            
            //Collection js start here
            
            saswpCollectionSlider();
                                              
            
            

            $(document).on("click", ".saswp-add-rv-btn", function(){

              $(".saswp-dynamic-platforms").toggle();
              
            });

            $(".saswp-rmv-coll-rv").on("click", function(){

              rmv_boolean = rmv_boolean ? false : true;                             
              
              //var new_coll = saswp_total_collection.map(v => Object.assign(v, {is_remove: rmv_boolean}));

              //if(new_coll){
                
                //saswp_total_collection = new_coll;
                saswp_on_collection_design_change();

                jQuery(jQuery(".saswp-add-dynamic-section")).remove();

                if(rmv_boolean){
                  var html ='';
                  html +='<div class="saswp-add-dynamic-section">';
                  html += '<div class="saswp-add-dynamic-btn">';
                  html +='<span class="dashicons dashicons-plus-alt saswp-add-rv-btn"></span>';
                  html += '</div>';
                  html +='<div class="saswp-dynamic-platforms" style="display:none;">';
                  var platforms_html = jQuery("#saswp-plaftorm-list").html();
                  html +='<select name="saswp_dynamic_platforms" id="saswp_dynamic_platforms"><option value="">Choose Platform</option>'+platforms_html+'</select>';
                  html +='</div>';                    
                  html +='</div>';
                
                  jQuery(jQuery(".saswp-collection-preview")[0]).after(html);                
                }
                
             // }              
                            
            }); 
            $(document).on("change", "#saswp_dynamic_platforms", function(){

              var platform_id = $(this).val();

              var html  = '';
                  html += '<select id="saswp_dynamic_reviews_list">';                  
                  html += '</select>';
                  html += '<a class="button button-default saswp-add-single-rv">Add</a>';
              
              $("#saswp_dynamic_platforms").nextAll().remove();
              $("#saswp_dynamic_platforms").after(html);

              var ajaxnewurl = ajaxurl + '?action=saswp_add_reviews_to_select2&saswp_security_nonce='+saswp_localize_data.saswp_security_nonce+'&platform_id='+platform_id;   

              $('#saswp_dynamic_reviews_list').select2({
                ajax: {
                  url: ajaxnewurl,
                  dataType: 'json',
                  processResults: function(data){
                    if(data.status){
                      return {
                        results: data.message
                      };
                    }
                  }                  
                }
              });
                
            });

            $(document).on("click", ".saswp-add-single-rv", function(e) {
              e.preventDefault();

              var review_id   = $("#saswp_dynamic_reviews_list").val();
              var platform_id = $("#saswp_dynamic_platforms").val();
              var is_remove   = true;
              if(review_id){
                saswp_get_collection_data(null, platform_id, null, review_id, is_remove);
              }
              

            });
              
            $(document).on("click" ,".saswp-remove-coll-rv", function(){

                var review_id     = $(this).attr('data-id');                
                var platform_id = $(this).attr('platform-id');                
                
                if(platform_id){

                  var myarray = saswp_collection[platform_id].filter(function( obj ) {
                    return obj.saswp_review_id != review_id;
                  });
                  saswp_collection[platform_id] = myarray;                
                  saswp_on_collection_design_change();

                }
                                                                
            })
               
            $(document).on("click", ".saswp-grid-page", function(e){
                e.preventDefault();
                saswp_grid_page  = $(this).attr('data-id');               
                saswp_on_collection_design_change();                                    
            });                  
               
            $("#saswp-coll-pagination").change(function(){
                saswp_grid_page = 1;
                $("#saswp-coll-per-page").parent().addClass('saswp_hide_imp');
                
                if($(this).is(":checked")){
                    $("#saswp-coll-per-page").parent().removeClass('saswp_hide_imp');
                }
                 saswp_on_collection_design_change();   
                
            });   
                              
            $(".saswp-accordion").click(function(){
              $(this).toggleClass("active");  
              $(this).next(".saswp-accordion-panel").slideToggle(200);
            });
          
            $(document).on("click", ".saswp-opn-cls-btn", function(){
                
                $("#saswp-reviews-cntn").toggle();
                
                if( $('#saswp-reviews-cntn').is(':visible') ) {
                    $(".saswp-onclick-show").css('display','flex');
                    $(".saswp-onclick-hide").hide();
                     $(".saswp-open-class").css('width', '500px');
                }
                else {
                    $(".saswp-onclick-show").css('display','none');
                    $(".saswp-onclick-hide").show();
                    $(".saswp-open-class").css('width', '300px');
                }
                                                                                
            });
            $(".saswp-collection-display-method").change(function(){
                                              
               if($(this).val() == 'shortcode'){
               $(".saswp-collection-shortcode").removeClass('saswp_hide');    
               }else{
               $(".saswp-collection-shortcode").addClass('saswp_hide');    
               }
                               
            }).change();
            $(document).on("click", ".saswp-remove-platform", function(e){
               
                e.preventDefault();
                                                                
                var platform_id = $(this).attr('platform-id');                                                
                saswp_collection.splice(platform_id, 1);                                      
                $(this).parent().remove();
                saswp_on_collection_design_change();  
                                               
            });            
                                  
            $(".saswp-number-change").bind('keyup mouseup', function () {
                
                 saswp_on_collection_design_change();            
            });
                        
                                                  
            $(".saswp-coll-settings-options").change(function(){
                saswp_grid_page = 1;
                var design          = $(".saswp-collection-desing").val();                                                 
                var sorting         = $(".saswp-collection-sorting").val();                                                 
                $(".saswp-coll-options").addClass('saswp_hide');
                $(".saswp-collection-lp").css('height', 'auto'); 
                $(".saswp-rmv-coll-rv").hide();
                $(".saswp-add-dynamic-section").hide();

                if(design == 'grid'){
                    $(".saswp-grid-options").removeClass("saswp_hide");
                    $(".saswp-rmv-coll-rv").show();
                    $(".saswp-add-dynamic-section").show();
                    $('.saswp-coll-review-wrapper').removeClass('saswp_hide');
                    $('.saswp-badge-options').addClass('saswp_hide');
                }
                
                if(design == 'gallery'){                    
                    $(".saswp-slider-options").removeClass("saswp_hide");
                    $('.saswp-coll-review-wrapper').removeClass('saswp_hide');
                    $('.saswp-badge-options').addClass('saswp_hide');
                }
                
                if(design == 'fomo'){
                    $(".saswp-fomo-options").removeClass("saswp_hide");  
                    $(".saswp-collection-lp").css('height', '31px');
                    $('.saswp-coll-review-wrapper').addClass('saswp_hide'); 
                    $('.saswp-badge-options').addClass('saswp_hide'); 
                }
                
                if(design == 'popup'){
                    $(".saswp-collection-lp").css('height', '31px');     
                    $('.saswp-coll-review-wrapper').addClass('saswp_hide');              
                    $('.saswp-badge-options').addClass('saswp_hide');              
                }

                if(design == 'badge'){
                    $('.saswp-coll-review-wrapper').addClass('saswp_hide');
                    $('.saswp-badge-options').removeClass('saswp_hide');
                }

                if($("#saswp_collection_specific_rating").is(':checked')){
                  $("#saswp_collection_specific_rating_sel").parent().removeClass("saswp_hide");                  
                }else{
                  $("#saswp_collection_specific_rating_sel").parent().addClass("saswp_hide");                  
                }

                if(sorting == 'recent'){
                  $("#saswp_collection_specific_rating").parent().parent().removeClass("saswp_hide");                  
                  $("#saswp_collection_specific_rating_sel").parent().removeClass("saswp_hide"); 
                  
                  if($("#saswp_collection_specific_rating").is(':checked')){
                    $("#saswp_collection_specific_rating_sel").parent().removeClass("saswp_hide");                  
                  }else{
                    $("#saswp_collection_specific_rating_sel").parent().addClass("saswp_hide");                  
                  }
                  
                }else{
                  $("#saswp_collection_specific_rating").parent().parent().addClass("saswp_hide");                  
                  $("#saswp_collection_specific_rating_sel").parent().addClass("saswp_hide");                  
                }
                
                saswp_on_collection_design_change();  
                                                
            }).change();
            
            $(".saswp-add-to-collection").on("click", function(e){
                
                e.preventDefault();
                
                var current     = $(this);
                var platform_id = $("#saswp-plaftorm-list").val();
                var rvcount     = $("#saswp-review-count").val();
                let platformPlace = $("#saswp-review-platform-places").val();                 
                
                if(platform_id && rvcount > 0){
                    
                    current.addClass('updating-message');
                    
                    saswp_get_collection_data(rvcount, platform_id, current, null, null, platformPlace);
                    
                }else{
                    
                    alert('Enter Count');
                    
                }
                
            });
                        
            var reviews_list   = $("#saswp_total_reviews_list").val();

            if(reviews_list){
                
              saswp_get_collection_data(null, null, null, null, reviews_list);
                                           
            }   

            let getPlatformId = $('#saswp-plaftorm-list').find("option:first-child").val();
            saswp_get_platform_place_list(getPlatformId);                
            //Collection js ends here


// Text on Click Copy scripts
var tooltip, // global variables oh my! Refactor when deploying!
hidetooltiptimer

function createtooltip(){ // call this function ONCE at the end of page to create tool tip object
  tooltip = document.createElement('div')
  tooltip.style.cssText = 
    'position:absolute; background:black; color:white; padding:4px 6px;z-index:10000;'
    + 'border-radius:2px; font-size:12px;box-shadow:3px 3px 3px rgba(0,0,0,.4);'
    + 'opacity:0;transition:opacity 0.3s'
  tooltip.innerHTML = 'Copied!'
  document.body.appendChild(tooltip)
}

function showtooltip(e){
  var evt = e || event
  clearTimeout(hidetooltiptimer)
  tooltip.style.left = evt.pageX - 10 + 'px'
  tooltip.style.top = evt.pageY + 15 + 'px'
  tooltip.style.opacity = 1
  hidetooltiptimer = setTimeout(function(){
    tooltip.style.opacity = 0
  }, 500)
}

  createtooltip()
function selectElementText(el){
  var range = document.createRange() // create new range object
  range.selectNodeContents(el) // set range to encompass desired element text
  var selection = window.getSelection() // get Selection object from currently user selected text
  selection.removeAllRanges() // unselect any user selected text (if any)
  selection.addRange(range) // add range to Selection object to select it
}


function copySelectionText(){
  var copysuccess // var to check whether execCommand successfully executed
  try{
    copysuccess = document.execCommand("copy") // run command to copy selected text to clipboard
  } catch(e){
    copysuccess = false
  }
return copysuccess
}

var motivatebox = document.getElementById('saswp-motivatebox')
 
if(motivatebox){

    motivatebox.addEventListener('mouseup', function(e){
    var e = e || event // equalize event object between modern and older IE browsers
    var target = e.target || e.srcElement // get target element mouse is over
    if (target.className == 'motivate'){
        selectElementText(target) // select the element's text we wish to read
        var copysuccess = copySelectionText()
        if (copysuccess){
            //e.target.setAttribute("data-title", "copied");
            showtooltip(e);
        }
    }
}, false);
    
} 

$(document).on('change', '#saswp-plaftorm-list', function(e){
    e.preventDefault();
    let selectedPlatForm = $(this).val();
    saswp_get_platform_place_list(selectedPlatForm);
});

$(document).on('change', '.saswp_archive_list_type_class', function(e){
    e.preventDefault();
    if($(this).val() == 'ItemList'){
        $(".saswp_archive_schema_type_class").parent().parent().hide();
    }else{
        $(".saswp_archive_schema_type_class").parent().parent().show();
    }
});  

/**
 * @since 1.22
 * Function to display metalist options
 * Solution to ticket id #2026
 * */
$(document).on("change", ".saswp-custom-fields-name, .saswp-custom-meta-list", function(e){
    e.preventDefault();
    let customField = $('.saswp-custom-fields-name').val(); 
    let customList = $('.saswp-custom-meta-list').val();
    let currentClass = $(this).attr('class');
    if(currentClass == 'saswp-custom-fields-name'){
        customField = $(this).val();
        customList =  $(this).parent().next().find("select").val();   
    }
    if(currentClass == 'saswp-custom-meta-list'){
        customList =  $(this).val();
        customField = $(this).closest("tr").find(".saswp-custom-fields-name").val();   
    }

    if(customField == 'saswp_faq_main_entity' && customList == 'saswp_repeater_mapping'){
        let postId = $('.saswp-itemlist-item-type-list').attr('data-id');
        if($('.saswp-add-faq-repeat-que').length == 0){
             $(this).closest("tr").after('<tr class="saswp-add-faq-repeat-que"><td><a class="button saswp_add_schema_fields_on_fly saswp-faq-question saswp-faq-repeater-btn" data-id="'+postId+'" div_type="faq_repeater_question" fields_type="faq_repeater_question">Add Faq Question</a></td><td></td></tr>');    
        }
        if($('.saswp-faq-repeater-tr').length == 0){
            $(this).closest("tr").after('<tr class="saswp-faq-repeater-tr"><td colspan="5"><div class="saswp-faq-repeater-question-section-main "><div class="saswp-faq_repeater_question-section" data-id="'+postId+'"></div></div></td></tr>');
        }
    }else{
        let removeFlag = 0;
        $('.saswp-custom-meta-list').each(function(e){
            if($(this).val() == 'saswp_repeater_mapping'){
                removeFlag = 1;    
            }
        });
        if(removeFlag == 0){
            $('.saswp-faq-repeater-tr').remove();
            $('.saswp-faq-question').remove();
            $('.saswp-add-faq-repeat-que').remove();
        }
    }
});
// Code ends here    

/**
 * Display ratingbox custom css related elements if checkbox is checked
 * @since 1.27
 * */
$('#saswp-rating-module-css-app').change(function(e){
    if($(this).is(':checked')){
        $('.saswp-rbcc-fields').removeClass('saswp_hide');
    }else{
        $('.saswp-rbcc-fields').addClass('saswp_hide');
    }
}).change();

/**
 * Preview design changes on preforming the changes in settings
 * */
$(document).on('click', '#saswp-rtb-link', function(e){
    $('#saswp-appearance-modal').fadeIn();
});
$(document).on('click', '#saswp-appearance-modal-close', function(e){
    $('#saswp-appearance-modal').fadeOut();
});

$('#saswp-rbcc-review-bg-color').wpColorPicker({
    change: function (event, ui) {
        var element = event.target;
        var color = ui.color.toString();
        $('.saswp-rbcc-preview-head').css('background', color);
        $('.saswp-rbcc-rvs span').css('background', color);
    },
});

$('#saswp-rbcc-review-f-color').wpColorPicker({
    change: function (event, ui) {
        var element = event.target;
        var color = ui.color.toString();
        $('.saswp-rbcc-preview-head').css('color', color);
        $('.saswp-rbcc-rvs span').css('color', color);
    },
});

$('#saswp-rbcc-review-f-size').on('keyup',function(e){
    e.preventDefault();
    var rbccHdFsize = $(this).val() ;
    var rbccHdFunit = $('#saswp-rbcc-review-f-unit').val();
    if(rbccHdFsize <= 0){
        rbccHdFsize = 15;   
    }
    $('.saswp-rbcc-preview-head, .saswp-rbcc-rvs span').css('font-size', rbccHdFsize+rbccHdFunit);
});

$('#saswp-rbcc-review-f-unit').change(function(e){
    var rbccHdFsize = $('#saswp-rbcc-review-f-size').val() ;
    var rbccHdFunit = $(this).val();   
    $('.saswp-rbcc-preview-head, .saswp-rbcc-rvs span').css('font-size', rbccHdFsize+rbccHdFunit);
}).change();

$('#saswp-rbcc-if-color').wpColorPicker({
    change: function (event, ui) {
        var element = event.target;
        var color = ui.color.toString();
        $('.saswp-rbcc-rif').css('color', color);
    },
});

$('#saswp-rbcc-if-f-size').on('keyup',function(e){
    e.preventDefault();
    var rbccHdFsize = $(this).val() ;
    var rbccHdFunit = $('#saswp-rbcc-if-f-unit').val();
    if(rbccHdFsize <= 0){
        rbccHdFsize = 15;   
    }
    $('.saswp-rbcc-rif').css('font-size', rbccHdFsize+rbccHdFunit);
});

$('#saswp-rbcc-if-f-unit').change(function(e){
    var rbccHdFsize = $('#saswp-rbcc-if-f-size').val() ;
    var rbccHdFunit = $(this).val();   
    $('.saswp-rbcc-rif').css('font-size', rbccHdFsize+rbccHdFunit);
}).change();

$('#saswp-rbcc-stars-color').wpColorPicker({
    change: function (event, ui) {
        var element = event.target;
        var color = ui.color.toString();
        $('.saswp_star_color .saswp_star').attr('stop-color', color);  
    },
});

$('#saswp-rbcc-stars-f-size').on('keyup',function(e){
    e.preventDefault();
    var rbccHdFsize = $(this).val() ;
    var rbccHdFunit = 'px';
    if(rbccHdFsize <= 0){
        rbccHdFsize = 18;   
    }
    $('.saswp-rvw-str .saswp_star_color svg').css('width', rbccHdFsize+rbccHdFunit);
});

$('#saswp-rbcc-ar-color').wpColorPicker({
    change: function (event, ui) {
        var element = event.target;
        var color = ui.color.toString();
        $('.saswp-rbcc-rvar').css('color', color);
    },
});

$('#saswp-rbcc-ar-f-size').on('keyup',function(e){
    e.preventDefault();
    var rbccHdFsize = $(this).val() ;
    var rbccHdFunit = $('#saswp-rbcc-ar-f-unit').val();
    if(rbccHdFsize <= 0){
        rbccHdFsize = 48;   
    }
    $('.saswp-rbcc-rvar').css('font-size', rbccHdFsize+rbccHdFunit);
});

$('#saswp-rbcc-ar-f-unit').change(function(e){
    var rbccHdFsize = $('#saswp-rbcc-ar-f-size').val() ;
    var rbccHdFunit = $(this).val();   
    $('.saswp-rbcc-rvar').css('font-size', rbccHdFsize+rbccHdFunit);
}).change();

/**
 * Display review collection textarea if checkbox is checked
 * @since 1.27
 * */
 $(document).on('change', '#saswp_review_custom_chk_box', function(e){
    if($(this).is(':checked')){
        $('#saswp-review-cccc').show();
    }else{
        $('#saswp-review-cccc').hide();
    }
 });

 $(document).on('click', '#saswp-rbcc-reset', function(e){
    e.preventDefault();
    d_css = {'background':'#000', 'color':'#fff', 'font-size':'15px'}
    $('.saswp-rbcc-preview-head').css(d_css);
    $('.saswp-rbcc-rvs span').css(d_css);

    d_css = {'color':'#000', 'font-size':'18px'}
    $('.saswp-rbcc-rif').css(d_css);

    $('.saswp_star_color .saswp_star').attr('stop-color', '#000');
    $('.saswp-rvw-str .saswp_star_color svg').css('width', '18px');

    d_css = {'color':'#000', 'font-size':'48px'}
    $('.saswp-rbcc-rvar').css(d_css);

    bg_color = '#000'; font_color = '#fff';

    $('#saswp-rbcc-review-bg-color, #saswp-rbcc-if-color, #saswp-rbcc-stars-color, #saswp-rbcc-ar-color').val(bg_color);
    $('#saswp-rbcc-review-f-color').val(font_color);
    $('#saswp-rbcc-review-f-size').val('15');
    $('#saswp-rbcc-review-f-unit').val('px');
    $('#saswp-rbcc-if-f-size').val('18');
    $('#saswp-rbcc-if-f-unit').val('px');
    $('#saswp-rbcc-ar-f-size').val('48');
    $('#saswp-rbcc-ar-f-unit').val('px');
    $('#saswp-rbcc-stars-f-size').val('18');
    $('#saswp-rbcc-stars-f-unit').val('px');

    $('.saswp-rbcc-font-color .wp-color-result').css('background-color', '#fff');
    $('.saswp-rbcc-bg-color .wp-color-result').css('background-color', bg_color);
    $('.saswp-rbcc-bg-color .wp-color-result').css('color', font_color);
    $('.saswp-rbcc-dc .wp-color-result').css('background-color', bg_color);

 });

 /**
  * Code to save site key and secret key for accepted reviews
  * @since 1.27
  * */

 $(document).on('change', '#saswp_enable_gcaptcha', function(e){
    if($(this).is(':checked')){
        $('#saswp-gkey-captcha-wrapper').removeClass('saswp_hide');
    }else{
        $('#saswp-gkey-captcha-wrapper').addClass('saswp_hide');
    }
 });

 $(document).on('click', '#saswp-ar-form-btn', function(e){
    let gsitekey = $('#saswp_g_site_key').val();
    let gsecretkey = $('#saswp_g_secret_key').val();
    let captchaEnable = 0;
    let postData = {};
    if($('#saswp_enable_gcaptcha').is(':checked')){
        captchaEnable = 1;
        postData = {action:'saswp_update_google_captch_keys', captcha_enable:captchaEnable, gsitekey: gsitekey, gsecretkey: gsecretkey, saswp_security_nonce:saswp_localize_data.saswp_security_nonce};
    }else{
        postData = {action:'saswp_update_google_captch_keys', captcha_enable:captchaEnable, saswp_security_nonce:saswp_localize_data.saswp_security_nonce};
    }

    $.ajax({
        url : ajaxurl,
        method : "POST",
        data: postData,
        success: function(responseData){
            location.reload();
        }
    });
 });
 
 $(document).on('click', '.saswp-tools-tab-nav', function(e){

    e.preventDefault();
    let divId   =   $(this).attr('data-div-id');
    $('.saswp-tools-tab-nav').removeClass('saswp-global-selected');
    $(this).addClass('saswp-global-selected');
    $('#saswp-advanced-sub-tab').hide();
    $('#saswp-migration-sub-tab').hide();
    $('#saswp-import-export-sub-tab').hide();
    $('#saswp-misc-sub-tab').hide();
    $('#saswp-translation-sub-tab').hide();
    $('#saswp-license-sub-tab').hide();
    $('#'+divId).show();

 });
});