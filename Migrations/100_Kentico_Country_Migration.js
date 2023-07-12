const { ProjectInformationQuery } = require("@kentico/kontent-management");
const { doc } = require("prettier");
const { v4: uuidv4 } = require('uuid');
const { htmlToText } = require('html-to-text');

/*
*  Kentico Country code migration
*/
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });


const migration = {
    order: 100,
    run: (apiClient) => __awaiter(void 0, void 0, void 0, function* () {

        const _migrationBatchID = "MIGRATION: " + "#13: "; 

        // Find language variants of the core___article type.
        const articleVariantsResponse = yield apiClient
        .listLanguageVariantsOfContentType()
        .byTypeCodename('core___article')
        .toAllPromise();

        // Get all the data items associated with the variant types
        const articleLanguageVariants = articleVariantsResponse.data.items;

        // Add all the existing articles to an array.
        const existingArticles = [];
        for (const articleLanguageVariant of articleLanguageVariants) {

            existingArticles.push(
                articleLanguageVariant.elements[0].value
            );
        }
        console.log('Articles Existing already: ' + existingArticles.length);

        var objExistingWebLinks = [];

        // Get all existing WEB-LINKS.
        const weblinkTypeResponse = yield apiClient
        .viewContentType()
        .byTypeCodename('web_external_link')
        .toPromise();

        // Get all Web link language variants
        const weblinkVariantsResponse = yield apiClient
        .listLanguageVariantsOfContentType()
        .byTypeCodename('web_external_link')
        .toPromise();

        // Extract the data rows.
        const webLinkLanguageVariants = weblinkVariantsResponse.data.items;
        console.log("WEB-LINK instances found..." + webLinkLanguageVariants.length)

        // Loop through them.
        const _wl_url_element = 1;
        for (const weblinkLanguageVariant of webLinkLanguageVariants) {
            objExistingWebLinks.push({"link":weblinkLanguageVariant.elements[_wl_url_element].value, "id":weblinkLanguageVariant.item.id})
            console.log("LINK:" + weblinkLanguageVariant.elements[_wl_url_element].value);
        }

        // Read input from JSON file.
        var inputData = ReadInputFile("./data/article-batch-13.json");

        // Parse into an object variable.
        var obj = JSON.parse(inputData);


        // Process each article edge node.
        for (let iArticleEdgeNode = 0; iArticleEdgeNode < obj.data.allHelp_articles.edges.length; ++iArticleEdgeNode) {


            // Extract the curent node.
            var _currentArticleEdgeNode = obj.data.allHelp_articles.edges[iArticleEdgeNode].node;

            console.log("********************************************************************************")
            console.log("Processing: " + _currentArticleEdgeNode._meta.id + " " + _currentArticleEdgeNode.title)
            console.log("********************************************************************************")

            // Assign the main Article attributes.
            var _title = _currentArticleEdgeNode.title;
            //var id = obj.data.allHelp_articles.edges[0].node._meta.id;


            // Build the BODY of the article as a series of object references and an array of components.
            var _bodySliceObjectList = "";
            var _bodySliceObjects = [];
        

            // Process each slice within the BODY element.
            var _bodySliceCount = (!(_currentArticleEdgeNode.body === null)) ? _currentArticleEdgeNode.body.length : 0;
            for (let iBodySliceCount = 0; iBodySliceCount < _bodySliceCount; ++iBodySliceCount) {

                var objID = uuidv4();
                
                // Which SLICE are we processing?
                console.log("Processing SLICE:" + _currentArticleEdgeNode.body[iBodySliceCount].type)
                switch (_currentArticleEdgeNode.body[iBodySliceCount].type) {

                    case 'introduction':
                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push(SLICE_Introduction(_currentArticleEdgeNode.body[iBodySliceCount], objID));
                        break;

                    case 'on_this_page':
                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push(SLICE_OnThisPage(_currentArticleEdgeNode.body[iBodySliceCount], objID));
                        break;
        
                    case 'heading':
                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push(SLICE_Heading(_currentArticleEdgeNode.body[iBodySliceCount], objID));
                        break;

                    case 'back_to_top':
                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push(SLICE_BackToTop(_currentArticleEdgeNode.body[iBodySliceCount], objID));
                        break;
        
                    case 'rich_text':
                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push(SLICE_RichText(_currentArticleEdgeNode.body[iBodySliceCount], objID));
                        break;

                    case 'icon_list':
                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push(SLICE_IconList(_currentArticleEdgeNode.body[iBodySliceCount], objID));
                        break;

                    case 'quote':
                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push(SLICE_Quote(_currentArticleEdgeNode.body[iBodySliceCount], objID));
                        break;
        
                    case 'note':
                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push(SLICE_Note(_currentArticleEdgeNode.body[iBodySliceCount], objID));
                        break;

                    case 'html':
                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push(SLICE_HTML(_currentArticleEdgeNode.body[iBodySliceCount], objID));
                        break;

                    case 'steps':
                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push(SLICE_Step(_currentArticleEdgeNode.body[iBodySliceCount], objID));
                        break;    

                    case 'link_list':
                        
                            /* This section deals with 'linked items' and creating a type instance that can be shared by other Link List types. */
                            /* If the type being linked too already exists then it will use that instead of creating a new one. */

                            //var objExistingWebLinks = [];
                            var objectIDs = [];

                            // Linked list items have to be created at this level - they can't be created outside of this function unfortunately. 
                            // Create these before dropping into the SLICE handling function, and then link up later.
                            var _objWLSlice = _currentArticleEdgeNode.body[iBodySliceCount];
                         

                            // Process each linked list object.
                            for (let ilistItemObject = 0; ilistItemObject < _objWLSlice.fields.length; ++ilistItemObject) {
                                        
                                // Is it an external link? 
                                var _existsAlready = true;
                                var _externalLink = "";
                                var _externalTitle = (!(_objWLSlice.fields[ilistItemObject].link_list_title === null)) ? _objWLSlice.fields[ilistItemObject].link_list_title : "";
                                var _externalDisplayText = (!(_objWLSlice.fields[ilistItemObject].link_list_description === null)) ? _objWLSlice.fields[ilistItemObject].link_list_description : "";
                                
                                console.log("     + title: " + _externalTitle);
                                console.log("     + display text: " + _externalDisplayText);

                                if (_objWLSlice.fields[ilistItemObject].link_list_link && _objWLSlice.fields[ilistItemObject].link_list_link.__typename === "_ExternalLink") {
                                    if (_objWLSlice.fields[ilistItemObject].link_list_link.url && _objWLSlice.fields[ilistItemObject].link_list_link.url.length >0) {

                                        // Does it exist already? 
                                        var _someExistingObj = objExistingWebLinks.find((x) => x.link === _objWLSlice.fields[ilistItemObject].link_list_link.url);
                                        if (!_someExistingObj) {

                                            _externalLink = _objWLSlice.fields[ilistItemObject].link_list_link.url;

                                            _existsAlready = false;
                                            console.log("     + Will insert new link:" + _externalLink);
                                        } else {
                                            objectIDs.push({"id": _someExistingObj.id});
                                        }
                                        console.log("     + exists already?:" + _existsAlready);
                                    } else {
                                        console.log("     + no url found.");
                                        _existsAlready = false;
                                    }
                                } else {
                                    console.log("     + processing " + _objWLSlice.fields[ilistItemObject].link_list_link.__typename + "link type.")
                                    _existsAlready = true;  // Don't create external link as link is probably a link to a prismic document.
                                }

                                // If the web link item doesn't exist -> create it
                                if (!_existsAlready) {

                                    const itemWebLINKResponse = yield apiClient
                                    .addContentItem()
                                    .withData({
                                        name: _migrationBatchID + _externalTitle,
                                        type: {
                                            codename: 'web_external_link',
                                        },
                                    })
                                    .toPromise();
                                    
                                    // Capture the object ID's
                                    objectIDs.push({"id": itemWebLINKResponse.data.id});

                                    // POPULATE it.
                                    yield apiClient
                                    .upsertLanguageVariant()
                                    .byItemId(itemWebLINKResponse.data.id)
                                    .byLanguageCodename('default')
                                    .withData((builder) => [
                                        builder.textElement({
                                            element: {
                                                codename: 'link__display_text',
                                            },
                                            value: _externalDisplayText,
                                        }),
                                        builder.textElement({
                                            element: {
                                                codename: 'link__url',
                                            },
                                            value: _externalLink,
                                        }),
                                        builder.textElement({
                                            element: {
                                                codename: 'link__title',
                                            },
                                            value: _externalTitle,
                                        }),
                                        builder.textElement({
                                            element: {
                                                codename: 'link__open_link_in_new_window',
                                            },
                                            value: [{"codename": "yes"}],
                                        }),

                                    ])
                                    .toPromise();

                                    // Push the new Object
                                    objExistingWebLinks.push({"link":_externalLink, "id":itemWebLINKResponse.data.id})
                                    
                                    console.log("     + created new")

                                } else {
                                    console.log("     + didn't create new.")
                                }
                            }

                            _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                            _bodySliceObjects.push({id: objID, type: 
                                {codename: "slice___list"}, 
                                    elements: [
                                        {
                                            element: {
                                                codename: "linked_list_items"
                                            },
                                            value: objectIDs
                                        }
                                    ]});
                            
                        
                        break;    

                    case 'clear_float':
                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push(SLICE_ClearFloat(_currentArticleEdgeNode.body[iBodySliceCount], objID));
                        break;

                    case 'table':
                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push(SLICE_Table(_currentArticleEdgeNode.body[iBodySliceCount], objID));
                        break;

                    case 'video':

                        /* This section deals with 'Video' and creating a type instance that can be shared by other Link List types. */
                            /* If the type being linked too already exists then it will use that instead of creating a new one. */
                            
                            var objExistingVideoAssets = [];
                            var objectIDs = [];

                            // Linked items have to be created at this level - they can't be created outside of this function unfortunately. 
                            var _obj = _currentArticleEdgeNode.body[iBodySliceCount];


                            // Get all existing CORE-Assets.
                            const OUAssetTypeResponse = yield apiClient
                                .viewContentType()
                                .byTypeCodename('asset')
                                .toPromise();

                            // Get all CORE-Asset language variants
                            const OUAssetVariantsResponse = yield apiClient
                            .listLanguageVariantsOfContentType()
                            .byTypeCodename('asset')
                            .toPromise();

                            // Extract the data rows.
                            const coreAssetLanguageVariants = OUAssetVariantsResponse.data.items;
                                
                            // Loop through them.
                            const _url_element = 4;
                            for (const coreAssetLanguageVariant of coreAssetLanguageVariants) {
                                
                                if (coreAssetLanguageVariant.elements[_url_element].value.length > 0) {
                                    objExistingVideoAssets.push({"link":coreAssetLanguageVariant.elements[_url_element].value, "id":coreAssetLanguageVariant.item.id})
                                }
                            }

                            console.log("List of existing video assets found:" + objExistingVideoAssets.length);


                            // Process each VIDEO object.
                            for (let iVideoObject = 0; iVideoObject < _obj.fields.length; ++iVideoObject) {

                                console.log("+++ Processing video object : " + iVideoObject);

                                // If the CORE -ASSET item doesn't exist -> create it
                                var _someExistingObj = objExistingVideoAssets.find((x) => x.link === _obj.fields[iVideoObject].video_url.url);
                                if (!_someExistingObj) {

                                    console.log("No pre-existing video found - creating new...");

                                    const _videoCreationResponse = yield apiClient
                                    .addContentItem()
                                    .withData({
                                        name: _migrationBatchID + "VIDEO ASSET " +_obj.fields[iVideoObject].video_title,
                                        type: {
                                            codename: 'asset',
                                        },
                                    })
                                    .toPromise();

                                    console.log("Created video type instance");

                                    // Capture the object ID's
                                    objectIDs.push({"id": _videoCreationResponse.data.id});

                                    // Build the TRANSCRIPT field.
                                    var _transcriptText ='';
                                    for (let iParagraph = 0; iParagraph < _obj.fields[iVideoObject].video_transcript.length; ++iParagraph) {

                                        var _Object = _obj.fields[iVideoObject].video_transcript[iParagraph];

                                        switch (_Object.type) {
                                            case "paragraph":
                                                // Apply any paragraph styles that are present.
                                                _transcriptText = _transcriptText + processParagraphSpans(_Object);
                                                break;
                                            default:
                                                console.log("Note rich text content type not handled: " + _Object.type);
                                        }
                                    }

                                    console.log("Transcript prepared");
                                    console.log("Title:" + _obj.fields[iVideoObject].video_title);
                                    console.log("URL:" + _obj.fields[iVideoObject].video_url.url);
                                    console.log("Poster:" + _obj.fields[iVideoObject].video_poster);
                                    console.log("Duration:" + _obj.fields[iVideoObject].video_duration);
                                    
                                    var _posterURL = "" //(!_obj.fields[iVideoObject].video_poster) ? _obj.fields[iVideoObject].video_poster.url : "";


                                    // POPULATE it.
                                    yield apiClient
                                    .upsertLanguageVariant()
                                    .byItemId(_videoCreationResponse.data.id)
                                    .byLanguageCodename('default')
                                    .withData((builder) => [
                                        builder.textElement({
                                            element: {
                                                codename: 'media_selection',
                                            },
                                            value: [{"codename": "video"}],
                                        }),
                                        builder.textElement({
                                            element: {
                                                codename: 'media_title',
                                            },
                                            value: _obj.fields[iVideoObject].video_title,
                                        }),
                                        builder.textElement({
                                            element: {
                                                codename: 'media_url',
                                            },
                                            value: _obj.fields[iVideoObject].video_url.url,
                                        }),
                                        builder.textElement({
                                            element: {
                                                codename: 'media_poster',
                                            },
                                            value: _posterURL,
                                        }),
                                        builder.textElement({
                                            element: {
                                                codename: 'media_duration',
                                            },
                                            value: _obj.fields[iVideoObject].video_duration,
                                        }),
                                        builder.textElement({
                                            element: {
                                                codename: 'media_transcript',
                                            },
                                            value: _transcriptText,
                                        })
                                    ])
                                    .toPromise();

                                    console.log("populated..");

                                } else {

                                    console.log("Linking to existing video..")

                                    // A Video with a matching URL already exists - link to that instead.
                                    objectIDs.push({"id": _someExistingObj.id})

                                }

                            }

                            

                            _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                            _bodySliceObjects.push({id: objID, type: 
                                {codename: "slice___video"}, 
                                    elements: [
                                        {
                                            element: {
                                                codename: "videos"
                                            },
                                            value: objectIDs
                                        }
                                    ]});
                        break;

                    case 'audio':

                        /* This section deals with 'Video' and creating a type instance that can be shared by other Link List types. */
                        /* If the type being linked too already exists then it will use that instead of creating a new one. */
                        
                        var objExistingAudioAssets = [];
                        var objectIDs = [];

                        // Linked items have to be created at this level - they can't be created outside of this function unfortunately. 
                        var _obj = _currentArticleEdgeNode.body[iBodySliceCount];


                        // Get all existing CORE-Assets.
                        const OUAssetAudioTypeResponse = yield apiClient
                            .viewContentType()
                            .byTypeCodename('asset')
                            .toPromise();

                        // Get all CORE-Asset language variants
                        const OUAssetAudioVariantsResponse = yield apiClient
                            .listLanguageVariantsOfContentType()
                            .byTypeCodename('asset')
                            .toPromise();


                        // Extract the data rows.
                        const coreAssetAudioLanguageVariants = OUAssetAudioVariantsResponse.data.items;
                            
                        // Loop through them.
                        const _audio_url_element = 4;
                        for (const coreAssetAudioLanguageVariant of coreAssetAudioLanguageVariants) {
                            
                            if (coreAssetAudioLanguageVariant.elements[_audio_url_element].value.length > 0) {
                                objExistingAudioAssets.push({"link":coreAssetAudioLanguageVariant.elements[_audio_url_element].value, "id":coreAssetAudioLanguageVariant.item.id})
                            }
                        }

                        console.log("List of existing audio assets found:" + objExistingAudioAssets.length);


                        // Process each AUDIO object.
                        for (let iAudioObject = 0; iAudioObject < _obj.fields.length; ++iAudioObject) {

                            console.log("+++ Processing audio object : " + iAudioObject);

                            // If the CORE -ASSET item doesn't exist -> create it
                            var _someExistingObj = objExistingAudioAssets.find((x) => x.link === _obj.fields[iAudioObject].audio_url.url);
                            if (!_someExistingObj) {

                                console.log("No pre-existing audio found - creating new...");

                                const _audioCreationResponse = yield apiClient
                                .addContentItem()
                                .withData({
                                    name: _migrationBatchID + " AUDIO ASSET " + _obj.fields[iAudioObject].audio_title,
                                    type: {
                                        codename: 'asset',
                                    },
                                })
                                .toPromise();

                                console.log("Created audio type instance");

                                // Capture the object ID's
                                objectIDs.push({"id": _audioCreationResponse.data.id});

                                // Build the TRANSCRIPT field.
                                var _transcriptText ='';
                                for (let iParagraph = 0; iParagraph < _obj.fields[iAudioObject].audio_transcript.length; ++iParagraph) {

                                    var _Object = _obj.fields[iAudioObject].audio_transcript[iParagraph];

                                    switch (_Object.type) {
                                        case "paragraph":
                                            // Apply any paragraph styles that are present.
                                            _transcriptText = _transcriptText + processParagraphSpans(_Object);
                                            break;
                                        default:
                                            console.log("Note rich text content type not handled: " + _Object.type);
                                    }
                                }

                                console.log("Transcript prepared");
                                console.log("Title:" + _obj.fields[iAudioObject].audio_title);
                                console.log("URL:" + _obj.fields[iAudioObject].audio_url.url);
                                console.log("Duration:" + _obj.fields[iAudioObject].audio_duration);
                                


                                // POPULATE it.
                                yield apiClient
                                .upsertLanguageVariant()
                                .byItemId(_audioCreationResponse.data.id)
                                .byLanguageCodename('default')
                                .withData((builder) => [
                                    builder.textElement({
                                        element: {
                                            codename: 'media_selection',
                                        },
                                        value: [{"codename": "audio"}],
                                    }),
                                    builder.textElement({
                                        element: {
                                            codename: 'media_title',
                                        },
                                        value: _obj.fields[iAudioObject].audio_title,
                                    }),
                                    builder.textElement({
                                        element: {
                                            codename: 'media_url',
                                        },
                                        value: _obj.fields[iAudioObject].audio_url.url,
                                    }),
                                    builder.textElement({
                                        element: {
                                            codename: 'media_poster',
                                        },
                                        value: "",
                                    }),
                                    builder.textElement({
                                        element: {
                                            codename: 'media_duration',
                                        },
                                        value: _obj.fields[iAudioObject].audio_duration,
                                    }),
                                    builder.textElement({
                                        element: {
                                            codename: 'media_transcript',
                                        },
                                        value: _transcriptText,
                                    })
                                ])
                                .toPromise();

                                console.log("populated..");

                            } else {

                                console.log("Linking to existing audio..")

                                // An audio with a matching URL already exists - link to that instead.
                                objectIDs.push({"id": _someExistingObj.id})

                            }

                        }

                        

                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push({id: objID, type: 
                            {codename: "slice___audio"}, 
                                elements: [
                                    {
                                        element: {
                                            codename: "audio_assets"
                                        },
                                        value: objectIDs
                                    }
                                ]});
                    break;

                    case 'action_link':

                        /* This section deals with 'Video' and creating a type instance that can be shared by other Link List types. */
                        /* If the type being linked too already exists then it will use that instead of creating a new one. */
                        console.log("****** ACTION LINK SLICE PROCESSING *****************")

                        //var objExistingActionLinksAssets = [];
                        var objectIDs = [];

                        // Linked items have to be created at this level - they can't be created outside of this function unfortunately. 
                        var _obj = _currentArticleEdgeNode.body[iBodySliceCount];


                        // Get all existing WEB-Links.
                        /*
                        const _actionLinkTypeResponse = yield apiClient
                            .viewContentType()
                            .byTypeCodename('web_external_link')
                            .toPromise();

                        // Get all WEB-Link language variants
                        const _actionLinkVariantsResponse = yield apiClient
                            .listLanguageVariantsOfContentType()
                            .byTypeCodename('web_external_link')
                            .toPromise();


                        // Extract the data rows.
                        const _actionLinkLanguageVariants = _actionLinkVariantsResponse.data.items;
                            
                        // Loop through them.
                        const _al_url_element = 1;
                        for (const _actionLinkLanguageVariant of _actionLinkLanguageVariants) {
                            
                            if (_actionLinkLanguageVariant.elements[_al_url_element].value.length > 0) {
                                objExistingActionLinksAssets.push({"link":_actionLinkLanguageVariant.elements[_al_url_element].value, "id":_actionLinkLanguageVariant.item.id})
                            }
                        }

                        console.log("List of existing action links found:" + objExistingActionLinksAssets.length);

                        */

                        
                        // If the WEB-LINK item doesn't exist -> create it
                        var _someExistingObj = objExistingWebLinks.find((x) => (x.link === _obj.primary.action_link_link.url || x.link === "http://www.open.ac.uk"));
                        if (!_someExistingObj) {

                            console.log("No pre-existing links found - creating new...");

                            var _wlTitle = (!_obj.primary.action_link_title) ? _obj.primary.action_link_title : "Unknown";

                            const _webLinkCreationResponse = yield apiClient
                            .addContentItem()
                            .withData({
                                name: _migrationBatchID + _wlTitle,
                                type: {
                                    codename: 'web_external_link',
                                },
                            })
                            .toPromise();

                            console.log("Created web link instance");

                            // Capture the object ID's
                            objectIDs.push({"id": _webLinkCreationResponse.data.id});

                            var _action_link_display_text = (!_obj.primary.action_link_title) ? _obj.primary.action_link_title : "blank";
                            var _action_link_url = (!_obj.primary.action_link_link) ? _obj.primary.action_link_link.url : "http://www.open.ac.uk";
                            var _action_link_title = (!_obj.primary.action_link_title) ? _obj.primary.action_link_title : "blank";


                            // POPULATE it.
                            yield apiClient
                            .upsertLanguageVariant()
                            .byItemId(_webLinkCreationResponse.data.id)
                            .byLanguageCodename('default')
                            .withData((builder) => [
                                builder.textElement({
                                    element: {
                                        codename: 'link__display_text',
                                    },
                                    value: _action_link_display_text,
                                }),
                                builder.textElement({
                                    element: {
                                        codename: 'link__url',
                                    },
                                    value: _action_link_url,
                                }),
                                builder.textElement({
                                    element: {
                                        codename: 'link__title',
                                    },
                                    value:  _action_link_title,
                                }),
                                builder.textElement({
                                    element: {
                                        codename: 'link__open_link_in_new_window',
                                    },
                                    value: [{"codename": "yes"}],
                                }),

                            ])
                            .toPromise();

                            // Push the new Object
                            objExistingWebLinks.push({"link":_action_link_url, "id":_webLinkCreationResponse.data.id})
                            console.log("populated..");

                        } else {

                            console.log("Linking to existing web link")

                            // A web link with a matching URL already exists - link to that instead.
                            objectIDs.push({"id": _someExistingObj.id})

                        }
                    
                        var _layoutStyle = _obj.primary.style.toLowerCase();

                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push({id: objID, type: 
                            {codename: "slice___action_link"}, 
                                elements: [
                                    {
                                        element: {
                                            codename: "action_links"
                                        },
                                        value: objectIDs
                                    },
                                    {
                                        element: {
                                            codename: "style"
                                        },
                                        value: [{"codename": _layoutStyle}]
                                    }
                                ]});

                        break;

                    case 'image':

                        /* This section deals with 'Image' and creating a type instance that can be shared by other Link List types. */
                        /* If the type being linked too already exists then it will use that instead of creating a new one. */
                        
                        var objectIDs = [];

                        // Linked items have to be created at this level - they can't be created outside of this function unfortunately. 
                        var _obj = _currentArticleEdgeNode.body[iBodySliceCount];


                        const _imageCreationResponse = yield apiClient
                        .addContentItem()
                        .withData({
                            name: _migrationBatchID + " IMAGE ASSET " + _obj.primary.image_source.alt.slice(0,30),
                            type: {
                                codename: 'asset',
                            },
                        })
                        .toPromise();

                        // Capture the object ID's
                        objectIDs.push({"id": _imageCreationResponse.data.id});

                        var _image_caption_object = (!isEmptyObject(_obj.primary.image_caption)) ? _obj.primary.image_caption : "";


                        // Build the CAPTION field.
                        var _captionText ='';
                        for (let iParagraph = 0; iParagraph < _image_caption_object.length; ++iParagraph) {

                            var _Object = _image_caption_object[iParagraph];

                            switch (_Object.type) {
                                case "paragraph":
                                    // Apply any paragraph styles that are present.
                                    _captionText = _captionText + processParagraphSpans(_Object);
                                    break;
                                default:
                                    console.log("Note rich text content type not handled: " + _Object.type);
                            }
                        }
                    
                        var _imageLayout = "";
                        switch (_obj.primary.image_layout.toLowerCase()) {
                            case "left":
                                _imageLayout = "left";
                                break;
                            case "left small":
                                _imageLayout = "left_small";
                                break;
                            case "right":
                                _imageLayout = "right";
                                break;
                            case "right small":
                                _imageLayout = "right_small";
                                break;
                            case "portrait":
                                _imageLayout = "portrait";
                                break;
                            case "break out":
                                _imageLayout = "break_out";
                                break;
                            case "fullwidth":
                                _imageLayout = "fullwidth";
                                break;
                            default:
                                _imageLayout = "fullwidth";
                                break;
                        }

                    
                        // POPULATE it.
                        yield apiClient
                        .upsertLanguageVariant()
                        .byItemId(_imageCreationResponse.data.id)
                        .byLanguageCodename('default')
                        .withData((builder) => [
                            builder.textElement({
                                element: {
                                    codename: 'prismic_image_link',
                                },
                                value: _obj.primary.image_source.url,
                            }),
                            builder.textElement({
                                element: {
                                    codename: 'caption',
                                },
                                value: _captionText,
                            }),
                            builder.textElement({
                                element: {
                                    codename: 'image_width',
                                },
                                value: _obj.primary.image_source.dimensions.width.toString(),
                            }),
                            builder.textElement({
                                element: {
                                    codename: 'image_height',
                                },
                                value: _obj.primary.image_source.dimensions.height.toString(),
                            }),
                            builder.textElement({
                                element: {
                                    codename: 'layout',
                                },
                                value: [{"codename": _imageLayout}],
                            }),
                            builder.textElement({
                                element: {
                                    codename: 'bordered',
                                },
                                value: [{"codename": _obj.primary.bordered.toString()}],
                            })
                        ])
                        .toPromise();

                        _bodySliceObjectList = _bodySliceObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + objID + '\"></object>'
                        _bodySliceObjects.push({id: objID, type: 
                            {codename: "slice___image"}, 
                                elements: [
                                    {
                                        element: {
                                            codename: "slice_image_asset"
                                        },
                                        value: objectIDs
                                    }
                                ]});
                    
                            break;                

                default:
                    console.log('Unhandled SLICE type: ' + _currentArticleEdgeNode.body[iBodySliceCount].type);
                }
            }


            // ****************************************************
            // RELATED LINKS
            // ****************************************************
            console.log("Processing SECTION: Related links" )

            var _relatedLinks = _currentArticleEdgeNode.related_links;
            var _relatedLinksEnabled = _currentArticleEdgeNode.related_links_enabled.toString().toLowerCase();
            var _relatedLinksObjectIDs = [];

            if (_relatedLinks.length > 0) {

                console.log("     + links found: " + _relatedLinks.length)

                // Process each related link
                for (let irelatedLinkObject = 0; irelatedLinkObject < _relatedLinks.length; ++irelatedLinkObject) {

                    var _objRL = _relatedLinks[irelatedLinkObject];
                    var _rlLink = (!isEmptyObject(_objRL.related_links_link)) ? _objRL.related_links_link.url : "";
                    var _rlTitle = (!(_objRL.related_links_title === null)) ? _objRL.related_links_title : "";
                    var _rlDesc = (!(_objRL.related_links_description === null)) ? _objRL.related_links_description[0].text : "";

                    console.log("     + link: " + _rlLink);
                    console.log("     + title: " + _rlTitle);
                    console.log("     + desc: " + _rlDesc);


                    // Does a similar WEB-LINK exist already? 
                    if (_rlLink.length > 0) {
                        if (!objExistingWebLinks.find((x) => x.link === _rlLink)) {

                            console.log("     + No matching link - creating new.");

                            // It doesn't create it.
                            const itemWebLINKResponse = yield apiClient
                            .addContentItem()
                            .withData({
                                name: _migrationBatchID + _rlTitle,
                                type: {
                                    codename: 'web_external_link',
                                },
                            })
                            .toPromise();

                            // Capture the object ID's
                            _relatedLinksObjectIDs.push({"id": itemWebLINKResponse.data.id});

                            // POPULATE it.
                            yield apiClient
                            .upsertLanguageVariant()
                            .byItemId(itemWebLINKResponse.data.id)
                            .byLanguageCodename('default')
                            .withData((builder) => [
                                builder.textElement({
                                    element: {
                                        codename: 'link__display_text',
                                    },
                                    value: _rlDesc,
                                }),
                                builder.textElement({
                                    element: {
                                        codename: 'link__url',
                                    },
                                    value: _rlLink,
                                }),
                                builder.textElement({
                                    element: {
                                        codename: 'link__title',
                                    },
                                    value: _rlTitle,
                                }),
                                builder.textElement({
                                    element: {
                                        codename: 'link__open_link_in_new_window',
                                    },
                                    value: [{"codename": "yes"}],
                                }),

                            ])
                            .toPromise();

                            // Push the new Object
                            objExistingWebLinks.push({"link":_rlLink, "id":itemWebLINKResponse.data.id})
                            
                            console.log("     + No matching link - creatied.")

                        } else {
                            _relatedLinksObjectIDs.push({"id": _someExistingObj.id});
                        }
                    }
                }
            }


            // ****************************************************
            // NOTES
            // ****************************************************
            console.log("Processing SECTION: Journal Notes" )
            var _journalNotesComponents = [];
            var _journalNotesObjectsList = "";
            var _journalHelperID = uuidv4();
            var _todaysDate = new Date().toISOString();
            var _notesArchive = "";

            if (!(_currentArticleEdgeNode.notes === null)) {
                _notesArchive = "<p>" + _currentArticleEdgeNode.notes.replaceAll("<","").replaceAll(">","") + "</p>";
            } else {
                _notesArchive = "<p>Article was migrated from Prismic into Kontent.ai</p>"
            }
            _journalNotesObjectsList = '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + _journalHelperID + '\"></object>'
            _journalNotesComponents.push({id: _journalHelperID, type: {codename: "helper___journal"}, elements: [{element: {codename: "journal_when",},value: _todaysDate},{element: {codename: "journal_what",},value: _notesArchive}]});

            console.log("     + completed" )


            // ***********************************************************
            // Create the CORE ARTICLE.
            //
            // ***********************************************************
            const itemCOREArticleResponse = yield apiClient
                .addContentItem()
                .withData({
                    name: _migrationBatchID + _currentArticleEdgeNode.title,
                    type: {
                        codename: 'core___article',
                    },
            })
            .toPromise();
        
            var _coreArticleID = itemCOREArticleResponse.data.id;

            yield apiClient
            .upsertLanguageVariant()
            .byItemId(_coreArticleID)
            .byLanguageCodename('default')
            .withData((builder) => [
                builder.textElement({
                    element: {
                        codename: 'title',
                    },
                    value: _title,
                }),
                builder.textElement({
                    element: {
                        codename: 'content',
                    },
                    value: _bodySliceObjectList,
                    components: _bodySliceObjects
                
                }),
                builder.textElement({
                    element: {
                        codename: 'related_links',
                    },
                    value: _relatedLinksObjectIDs
                
                }),
                builder.textElement({
                    element: {
                        codename: 'related_links_enabled',
                    },
                    value: [{"codename": _relatedLinksEnabled}]
                
                }),
                builder.textElement({
                    element: {
                        codename: 'notes',
                    },
                    value: _journalNotesObjectsList,
                    components: _journalNotesComponents
                
                }),
            ])
            .toPromise();


            // ***********************************************************
            // Create the WEB-ARTICLE & link to the CORE-ARTICLE
            //
            // ***********************************************************
            const itemWebArticleResponse = yield apiClient
                .addContentItem()
                .withData({
                    name: _migrationBatchID + _currentArticleEdgeNode.title,
                    type: {
                        codename: 'web___article_web_page',
                    },
            })
            .toPromise();

            var _audienceTypes = _currentArticleEdgeNode.audiences.split(',');
            var _audienceTaxonomyObjects = [];
            for (let iAudienceType = 0; iAudienceType < _audienceTypes.length; ++iAudienceType) {
                _audienceTaxonomyObjects.push({"codename": _audienceTypes[iAudienceType].trim().replaceAll("-","_")})
            }


            var _webURL = "/" + _currentArticleEdgeNode.title.replaceAll(" ","-",);

            yield apiClient
            .upsertLanguageVariant()
            .byItemId(itemWebArticleResponse.data.id)
            .byLanguageCodename('default')
            .withData((builder) => [
                builder.textElement({
                    element: {
                        codename: 'page_url',
                    },
                    value: _webURL,
                }),
                builder.textElement({
                    element: {
                        codename: 'seo__title',
                    },
                    value: _currentArticleEdgeNode.title,
                }),
                builder.textElement({
                    element: {
                        codename: 'seo__description',
                    },
                    value: _currentArticleEdgeNode.description,
                
                }),
                builder.textElement({
                    element: {
                        codename: 'seo__keywords',
                    },
                    value: _currentArticleEdgeNode.keywords,
                }),
                builder.textElement({
                    element: {
                        codename: 'audience',
                    },
                    value: _audienceTaxonomyObjects,
                
                }),
                builder.textElement({
                    element: {
                        codename: 'article',
                    },
                    value: [{"id": _coreArticleID}]
                
                }),
                
            ])
            .toPromise();


        }

    }),
};

function isEmptyObject(_obj) {
    return (_obj === null || Object.keys(_obj).length === 0);
}

function ReadInputFile(fileName) {
    
    // Node.js file system module.
    const fs = require('fs');

    let _inputData = fs.readFileSync(fileName, "utf-8");

    return _inputData;
   
}

function SLICE_Introduction(obj, _dataID) {
    return {id: _dataID, type: {codename: "slice___introduction"}, elements: [{element: {codename: "introduction",},value: obj.primary.introduction_text}]}
}

function SLICE_OnThisPage(obj, _dataID) {
    return {id: _dataID, type: {codename: "slice___on_this_page"}, elements: [{element: {codename: "layout_style",},value: [{"codename": obj.primary.style.toLowerCase()}]}]}
}

function SLICE_Heading(obj, _dataID) {
    return {id: _dataID, type: {codename: "slice___heading"}, elements: [{element: {codename: "heading__h1_h6_",},value: "<h2>" + obj.primary.heading[0].text + "</h2>"}]}
}

function SLICE_BackToTop(obj, _dataID) {
    return {id: _dataID, type: {codename: "slice___back_to_top"}, elements: []}
}

function SLICE_RichText(obj, _dataID) {

    var _richTextValue = "";
    var _listItemStarted = false
    var _numberedListItemStarted = false

    console.log("     + rich text processing started")
    for (let iRichTextElementsCount = 0; iRichTextElementsCount < obj.primary.rich_text_content.length; ++iRichTextElementsCount) {

        switch (obj.primary.rich_text_content[iRichTextElementsCount].type) {

                case 'list-item':

                    if (_listItemStarted == false) {
                        _listItemStarted = true;
                        _richTextValue = _richTextValue + "<ul><li>" + obj.primary.rich_text_content[iRichTextElementsCount].text + "</li>";
                    } else {
                        _richTextValue = _richTextValue + "<li>" + obj.primary.rich_text_content[iRichTextElementsCount].text + "</li>";
                    }
                    
                    // Are we at the end ofthe array? 
                    if (obj.primary.rich_text_content.length === iRichTextElementsCount + 1) {
                        // There are no more entries
                        _richTextValue = _richTextValue + "</ul>"
                    } else {
                        // There are more entries - is the next one a list element? 
                        if (obj.primary.rich_text_content[iRichTextElementsCount+1].type != 'list-item') {
                            // It isn't - so close the element
                            _richTextValue = _richTextValue + "</ul>"
                            _listItemStarted = false;
                        }
                    }
                    break;

                case 'o-list-item':

                    if (_numberedListItemStarted == false) {
                        _numberedListItemStarted = true;
                        _richTextValue = _richTextValue + "<ol><li>" + obj.primary.rich_text_content[iRichTextElementsCount].text + "</li>";
                    } else {
                        _richTextValue = _richTextValue + "<li>" + obj.primary.rich_text_content[iRichTextElementsCount].text + "</li>";
                    }
                    
                    // Is the next item also a list item? 
                    if (obj.primary.rich_text_content.length == iRichTextElementsCount + 1) {
                        // There are no more entries
                        _richTextValue = _richTextValue + "</ol>"
                    } else {
                        // There are more entries - is the next one a list element? 
                        if (obj.primary.rich_text_content[iRichTextElementsCount+1].type != 'o-list-item') {
                            // It isn't - so close the element
                            _richTextValue = _richTextValue + "</ol>"
                            _numberedListItemStarted = false;
                        }
                    }
                    break;

                case 'paragraph':
                    
                    _richTextValue = _richTextValue + processParagraphSpans(obj.primary.rich_text_content[iRichTextElementsCount])
                    break;

                case 'heading1':
                    _richTextValue = _richTextValue + "<h1>" + obj.primary.rich_text_content[iRichTextElementsCount].text + "</h1>";
                    break
                case 'heading2':
                    _richTextValue = _richTextValue + "<h2>" + obj.primary.rich_text_content[iRichTextElementsCount].text + "</h2>";
                    break
                case 'heading3':
                    _richTextValue = _richTextValue + "<h3>" + obj.primary.rich_text_content[iRichTextElementsCount].text + "</h3>";
                    break
                case 'heading4':
                    _richTextValue = _richTextValue + "<h4>" + obj.primary.rich_text_content[iRichTextElementsCount].text + "</h4>";
                    break
                case 'heading5':
                    _richTextValue = _richTextValue + "<h5>" + obj.primary.rich_text_content[iRichTextElementsCount].text + "</h5>";
                    break
                case 'heading6':
                    _richTextValue = _richTextValue + "<h6>" + obj.primary.rich_text_content[iRichTextElementsCount].text + "</h6>";
                    break
                
                default:
                    console.log("Unhandled html element found in RT field: " + obj.primary.rich_text_content[iRichTextElementsCount].type);
                    break;

        }
    }
   
    console.log("     + rich text processing ending")

    return {id: _dataID, type: {codename: "slice___rich_text"}, elements: [{element: {codename: "richtext",},value: _richTextValue}]}
}

function SLICE_IconList(obj, _dataID) {

    var __valueObjectList = '';
    var __objectCollection = [];


    // Process the fields object.
    for (let iListObject = 0; iListObject < obj.fields.length; ++iListObject) {

        var _listItemObject = obj.fields[iListObject].list_item;
        var _listItemID = uuidv4();
       __valueObjectList = __valueObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + _listItemID + '\"></object>';

       if (!_listItemObject === null) {
            switch (_listItemObject[0].type) {
                case "paragraph":
                    // Icon lists contain paragraphs, that can contain strong, em and hyperlinks...Process the same way as RichText fields.
                    __objectCollection.push({id: _listItemID, type: {codename: "helper___icon_link_item"}, elements: [{element: {codename: "text",}, value: processParagraphSpans(_listItemObject[0])}]});                
                    break;
                default:
                    break;

            }
       } else {
            __objectCollection.push({id: _listItemID, type: {codename: "helper___icon_link_item"}, elements: [{element: {codename: "text",}, value: ""}]});
       }
    }
  

    return {id: _dataID, type: 
           {codename: "slice___icon_list"}, 
            elements: [
                {
                element: {
                    codename: "icon_type"
                },
                value: [{"codename": obj.primary.list_style.toLowerCase()}]
                },
                {
                    element: {
                        codename: "list_items_5383d59"
                    },
                    value: __valueObjectList,
                    components: __objectCollection
                }
            ]}
}

function SLICE_Quote(obj, _dataID) {
    
    console.log("     + checking input variables");

    var _citation_layout_style = "";
    var _quote_text_object = (obj.primary.quote_text != null) ? obj.primary.quote_text : "";
    var _quote_citation_text = (obj.primary.quote_citation != null) ? obj.primary.quote_citation[0].text : "";
    var _quote_text = "";


    console.log("     + check complete");
    console.log("     + building citation");
    console.log("     + Quote text length: " + _quote_text_object.length);

    // Build the citation rich text field.
    for (let iParagraph = 0; iParagraph < _quote_text_object.length; ++iParagraph) {

        var _Object = _quote_text_object[iParagraph];

        switch (_Object.type) {
            case "paragraph":
                // Apply any paragraph styles that are present.
                _quote_text = _quote_text + processParagraphSpans(_Object);
                break;
            default:
                console.log("Quote rich text content type not handled: " + _Object.type);
                break;
        }
    }

    console.log("     + citation complete");
    console.log("     + building style");

    // Convert the quote layout style.
    switch (obj.primary.quote_layout) {
        case "Fullwidth":
            _citation_layout_style = "full_width";
            break;
        case "Left":
            _citation_layout_style = "left_aligned";
            break;
        case "Right":
            _citation_layout_style = "right_aligned";
            break;
        default:
            console.log("Quote layout style not handled: " + obj.primary.quote_style);
            break;
    }

    console.log("     + style compelete");
    
    return {id: _dataID, type: {codename: "slice___quotation"}, 
            elements: [
            {
                element: {
                    codename: "quote_f710789"
                },
                value: _quote_text
            },
            {
                element: {
                    codename: "slice_citation",
                },
                value: _quote_citation_text
            },
            {
                element: {
                    codename: "on_page_alignment",
                },
                value: [{"codename": _citation_layout_style}]
            }
            ]
    }
}

function SLICE_Note(obj, _dataID) {
    
    var _note_layout_style = "";
    var _note_text = ""    ;
    var _note_title = "";


    // Build the note rich text field.
    for (let iParagraph = 0; iParagraph < obj.primary.note_body.length; ++iParagraph) {

        var _Object = obj.primary.note_body[iParagraph];

        switch (_Object.type) {
            case "paragraph":
                // Apply any paragraph styles that are present.
                _note_text = _note_text + processParagraphSpans(_Object);
                break;
            default:
                console.log("Note rich text content type not handled: " + _Object.type);
        }
    }

    // Build the style
    _note_layout_style = obj.primary.note_style.toLowerCase();


    // Build the note title.
    _note_title = obj.primary.note_title;


    
    return {id: _dataID, type: {codename: "slice___note"}, 
            elements: [
            {
                element: {
                    codename: "body"
                },
                value: _note_text
            },
            {
                element: {
                    codename: "title",
                },
                value:  _note_title
            },
            {
                element: {
                    codename: "style",
                },
                value: [{"codename": _note_layout_style}]
            }
            ]
    }
}

function SLICE_HTML(obj, _dataID) {
    return {id: _dataID, type: {codename: "slice___html"}, elements: [{element: {codename: "text",},value: obj.primary.code[0].text}]}
}

function SLICE_Step(obj, _dataID) {
    
    var __valueObjectList = '';
    var __objectCollection = [];


    // Process the fields object.
    for (let iStepObject = 0; iStepObject < obj.fields.length; ++iStepObject) {

        var _stepItemObject = obj.fields[iStepObject];
        var _stepItemID = uuidv4();

        __valueObjectList = __valueObjectList + '<object type=\"application/kenticocloud\" data-type=\"component\" data-id=\"' + _stepItemID + '\"></object>';

        switch (_stepItemObject.steps_text[0].type) {

            case "paragraph":

                // Icon lists contain paragraphs, that can contain strong, em and hyperlinks...Process the same way as RichText fields.
                __objectCollection.push({id: _stepItemID, type: {codename: "helper___step_item"}, elements: [
                                                                                                    {
                                                                                                    element: {codename: "title",},
                                                                                                    value: _stepItemObject.steps_title
                                                                                                    },
                                                                                                    {
                                                                                                     element: {codename: "body",}, 
                                                                                                     value: processParagraphSpans(_stepItemObject.steps_text[0])
                                                                                                     }]});                
                break;

            default:
                break;

        }
    }
  

    return {id: _dataID, type: 
           {codename: "slice___steps"}, 
            elements: [
                {
                    element: {
                        codename: "step_list"
                    },
                    value: __valueObjectList,
                    components: __objectCollection
                }
            ]}
}

function SLICE_HTML(obj, _dataID) {

    const _htmlFreeText = "<p>" + htmlToText(obj.primary.code[0].text) + "</p>";

    //const removeClassAttributeRegEx = / class=".*?"/gi;
    return {id: _dataID, type: {codename: "slice___html"}, elements: [{element: {codename: "text",},value:  _htmlFreeText }]}
}

function SLICE_ClearFloat(obj, _dataID) {
    return {id: _dataID, type: {codename: "slice___clear_float"}, elements: []}
}

function SLICE_Table(obj, _dataID) {

    var _deconstructedPrismicTableData = [];

    // Split the data on new lines.
    var _tableDataRows = obj.primary.csv_data.split("\n");
    
    console.log("Rows found = " + _tableDataRows.length);

    // Process each line.
    for (let iTableRows = 0; iTableRows < _tableDataRows.length; ++iTableRows) {

        // Split the row into it's columns, and add the row data to the overall table.
        _deconstructedPrismicTableData.push(_tableDataRows[iTableRows].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g));

        console.log("Row " + iTableRows + " data=" + _tableDataRows[iTableRows].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/g));
    }

    console.log("Column headers Enabled:" + obj.primary.column_headers_enabled);
    console.log("Row headers Enabled:" + obj.primary.row_headers_enabled);
    console.log("Prismic Table data:" + _deconstructedPrismicTableData);

    var _KontentTableMarkUp = "<table><tbody>"

    // Process each line.
    for (let iTableRows = 0; iTableRows < _deconstructedPrismicTableData.length; ++iTableRows) {

        // Process each columns
        var _tBodyGenerated = false;
        var _currentRow = _deconstructedPrismicTableData[iTableRows];
        for (let iColumn = 0; iColumn < _currentRow.length; ++iColumn) {

            if (iColumn === 0) {
                _KontentTableMarkUp = _KontentTableMarkUp + "<tr>"
            } 

            _KontentTableMarkUp = _KontentTableMarkUp + "<td>" + _currentRow[iColumn] + "</td>"

            if (iColumn === _currentRow.length-1) {
                _KontentTableMarkUp = _KontentTableMarkUp + "</tr>"
            }

        }
        
    }
    _KontentTableMarkUp = _KontentTableMarkUp + "</tbody></table>";


    console.log("Kontent Table data:" + _KontentTableMarkUp);


    var _layoutAdjustment = "";
    switch (obj.primary.layout) {

        case "Fullwidth":
            _layoutAdjustment = "fullwidth";
            break;
        case "Break out":
            _layoutAdjustment = "break_out";
            break;
        default:
            _layoutAdjustment = "fullwidth";
            break;
    }

    
    var _layout = [{"codename": _layoutAdjustment}];
    var _ch_enabled = [{"codename": (obj.primary.column_headers_enabled === true ? "yes" : "no")}];
    var _ch_wrap_content = [{"codename": (obj.primary.column_headers_wrap === true ? "yes" : "no")}];
    var _ch_sticky = [{"codename": (obj.primary.column_headers_sticky === true ? "yes" : "no")}];
    var _rh_enabled = [{"codename": (obj.primary.row_headers_enabled === true ? "yes" : "no")}];
    var _rh_wrap_content = [{"codename": (obj.primary.row_headers_wrap === true ? "yes" : "no")}];
    var _eq_col_widths = [{"codename": (obj.primary.column_equal_widths === true ? "yes" : "no")}];
    var _min_col_widths = [{"codename": (obj.primary.column_min_width === true ? "yes" : "no")}];
    var _bordered = [{"codename": (obj.primary.bordered === true ? "yes" : "no")}];
    var _striped = [{"codename": (obj.primary.striped === true ? "yes" : "no")}];
    var _caption = obj.primary.caption;



    return {id: _dataID, type: {codename: "slice___table"}, 
            elements: [
            {
                element: {
                    codename: "table_columns_and_rows"
                },
                value: _KontentTableMarkUp
            },
            {
                element: {
                    codename: "layout",
                },
                value: _layout
            },
            {
                element: {
                    codename: "column_headers__enabled",
                },
                value: _ch_enabled
            },
            {
                element: {
                    codename: "column_headers__wrap_content",
                },
                value: _ch_wrap_content
            },
            {
                element: {
                    codename: "column_headers__sticky",
                },
                value: _ch_sticky
            },
            {
                element: {
                    codename: "row_headers__enabled",
                },
                value: _rh_enabled
            },
            {
                element: {
                    codename: "row_headers__wrap_content",
                },
                value: _rh_wrap_content
            },
            {
                element: {
                    codename: "equal_column_widths",
                },
                value: _eq_col_widths
            },
            {
                element: {
                    codename: "minimum_column_widths",
                },
                value: _min_col_widths
            },
            {
                element: {
                    codename: "bordered",
                },
                value: _bordered
            },
            {
                element: {
                    codename: "striped",
                },
                value: _striped
            },            
            {
                element: {
                    codename: "caption",
                },
                value: _caption
            },
            ]
    }
}

function processParagraphSpans(_obj) {

    var _offset = 0;
    var _lastChangePoint = 0;
    var _content = _obj.text;
    var _objSpans = _obj.spans;

    if (_content.length > 0) {

        // Process all markup spans.
        for (let iSpanItem = 0; iSpanItem < _objSpans.length; ++iSpanItem) {

            // Grab the current span to apply.
            var _currentSpan = _objSpans[iSpanItem];

            // _offset variable is used to increase the span start and end points based on the tags we're injecting. ie <strong> etc..
            // _lastChangePoint variable - tracks the furthest point in the string that we've made changes.
            // As long as the next change is after this point we make it. - We don't handle nested span changes...ie <strong>....<em>..</em>..</strong>
            // I'm also assuming that the span changes are in increasing start locations within the string. ie the next one will always be further on than the last one..
            switch (_currentSpan.type) {

                case 'strong':

                    if ((_currentSpan.start + _offset) > _lastChangePoint) {

                        _content = _content.substring(0, _currentSpan.start + _offset) + 
                                    "<strong>" + _content.substring(_currentSpan.start + _offset, _currentSpan.end + _offset) + "</strong>" +
                                    _content.substring(_currentSpan.end + _offset);
                        _offset = _offset + 17;
                        _lastChangePoint = _currentSpan.end + _offset;
                    }
                    break;

                case 'em':

                    if ((_currentSpan.start + _offset) > _lastChangePoint) {

                        _content = _content.substring(0, _currentSpan.start + _offset) + 
                                    "<em>" + _content.substring(_currentSpan.start + _offset, _currentSpan.end + _offset) + "</em>" +
                                    _content.substring(_currentSpan.end + _offset);
                        
                        _offset = _offset + 9;
                        _lastChangePoint = _currentSpan.end + _offset;
                    }
                    break;
                
                case 'hyperlink':

                    // Only process 'Web' links.
                    if (_currentSpan.data.link_type === 'Web' && ((_currentSpan.start + _offset) > _lastChangePoint)) {

                        _content = _content.substring(0, _currentSpan.start + _offset) + 
                                    '<a href=\"' + _currentSpan.data.url + '\">' + _content.substring(_currentSpan.start + _offset, _currentSpan.end + _offset) + '</a>' +
                                    _content.substring(_currentSpan.end + _offset);
                        
                        _offset = _offset + 15 + _currentSpan.data.url.length;
                        _lastChangePoint = _currentSpan.end + _offset;
                    }
                    break;

                default:
                    console.log("Unhandled SPAN[] formatting element: " + _obj.primary.rich_text_content[iRichTextElementsCount].type);
                    break;
            }


        }

    }

    return "<p>" + _content + "</p>";
}



exports.default = migration;
