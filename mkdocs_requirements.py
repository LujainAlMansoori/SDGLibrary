import yaml

with open('mkdocs.yml', 'r') as yaml_file:
    config = yaml.safe_load(yaml_file)

plugins = config.get('plugins', [])
markdown_extensions = config.get('markdown_extensions', [])

requirements = plugins + markdown_extensions

with open('requirements.txt', 'w') as req_file:
    for req in requirements:
        req_file.write(req + '\n')
