application: ef_education_extension {
  label: "EF Education"
  url: "http://localhost:8080/bundle.js"
  entitlements: {
    use_embeds: yes
    use_form_submit: yes
    new_window_external_urls: ["https://www.docs.looker.com*","https://dcl.dev.looker.com*", "https://www.istockphoto.com/jp/%E3%82%A4%E3%83%A9%E3%82%B9%E3%83%88/%E3%81%9F%E3%81%93%E7%84%BC%E3%81%8D?mediatype=illustration&phrase=%E3%81%9F%E3%81%93%E7%84%BC%E3%81%8D&sort=mostpopular"]
    core_api_methods: ["me","all_user_attributes","user_attribute_user_values", "board","role", "all_groups", "run_inline_query", "user_attribute_user_values"]
    # external_api_urls: ["https://rapidapi.p.rapidapi.com/1729/math?fragment=true&json=true"]
    # scoped_user_attributes: ["luka_thesis_extension_data_portal_rapidapikey"]
    # global_user_attributes: ["rapidapikey"]
  }
}
