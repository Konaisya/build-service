def to_dict(obj):
    return {k: v for k, v in obj.__dict__.items() if k != '_sa_instance_state'}